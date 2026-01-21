import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { GlobalContext } from "../context/GlobalState";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const IncomeExpenseChart = () => {
  const { transactions } = useContext(GlobalContext);

  const amounts = transactions.map((transaction) => transaction.amount);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0);
  const expense =
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1;

  const data = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        label: "Jumlah (Rp)",
        data: [income, expense],
        backgroundColor: ["#2ecc71", "#c0392b"],
        borderColor: ["#2ecc71", "#c0392b"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Tetap false agar responsif
    layout: { padding: 10 },
    plugins: {
      legend: { position: "bottom", labels: { padding: 20 } },
    },
  };

  if (income === 0 && expense === 0) {
    return (
      <div
        className="chart-card"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#aaa" }}>Belum ada data transaksi.</p>
      </div>
    );
  }

  return (
    // HAPUS className="chart-wrapper" yang bikin bug
    // Kita ganti dengan div biasa yang height-nya 100% dari parent card
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3 className="chart-title">Analisis Keuangan</h3>

      {/* INI KUNCINYA: Kandang Khusus Chart */}
      {/* Kita beri tinggi fix relatif atau absolut agar tidak looping */}
      <div style={{ position: "relative", height: "300px", width: "100%" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
