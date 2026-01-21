import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { GlobalContext } from "../context/GlobalState";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const ExpenseChart = () => {
  const { transactions } = useContext(GlobalContext);

  const expenses = transactions.filter((transaction) => transaction.amount < 0);

  const categoryConfig = {
    Makanan: { color: "#e67e22", label: "🍔 Makanan" },
    Transport: { color: "#3498db", label: "🚗 Transport" },
    Tagihan: { color: "#9b59b6", label: "🏠 Tagihan" },
    Hiburan: { color: "#f1c40f", label: "🎬 Hiburan" },
    Gaji: { color: "#2ecc71", label: "💰 Gaji" },
    Lainnya: { color: "#95a5a6", label: "🔹 Lainnya" },
  };

  const expenseTotals = {};
  expenses.forEach((transaction) => {
    const cat = transaction.category || "Lainnya";
    const amount = Math.abs(transaction.amount);
    if (expenseTotals[cat]) expenseTotals[cat] += amount;
    else expenseTotals[cat] = amount;
  });

  const labels = Object.keys(expenseTotals);
  const dataValues = Object.values(expenseTotals);
  const backgroundColors = labels.map((cat) =>
    categoryConfig[cat] ? categoryConfig[cat].color : "#ccc",
  );

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 10 },
    plugins: {
      legend: {
        position: "bottom",
        labels: { padding: 20, usePointStyle: true },
      },
      title: { display: false },
    },
  };

  if (expenses.length === 0) return null;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3 className="chart-title">Detail Pengeluaran</h3>

      {/* INI KUNCINYA: Kandang Khusus Chart */}
      <div style={{ position: "relative", height: "300px", width: "100%" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
