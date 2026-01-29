import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { GlobalContext } from "../context/GlobalState";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const ExpenseChart = () => {
  const { transactions } = useContext(GlobalContext);

  // Ambil hanya pengeluaran
  const expenseTransactions = transactions.filter((t) => t.amount < 0);

  // Grouping Data
  const categories = {};
  expenseTransactions.forEach((t) => {
    const cat = t.category || "Lainnya";
    if (!categories[cat]) categories[cat] = 0;
    categories[cat] += Math.abs(t.amount);
  });

  const labels = Object.keys(categories);
  const dataValues = Object.values(categories);
  const emptyData = labels.length === 0;

  const data = {
    labels: emptyData ? ["Kosong"] : labels,
    datasets: [
      {
        data: emptyData ? [1] : dataValues,
        backgroundColor: [
          "#6c5ce7", // Ungu (Tagihan/Lainnya)
          "#00b894", // Hijau Teal (Investasi/Gaji)
          "#fdcb6e", // Kuning (Makanan)
          "#ff7675", // Merah (Transport)
          "#0984e3", // Biru (Belanja)
          "#e17055", // Oranye (Hiburan)
          "#d63031", // Merah Tua (Kesehatan)
          "#636e72", // Abu (Lainnya)
          "#a29bfe", // Ungu Muda
          "#55efc4", // Hijau Muda
        ],

        // --- RAHASIA 3D MODERN ---
        borderWidth: 0,
        hoverOffset: 15, // Pop-out effect
        borderRadius: 20, // Round edges
        spacing: 5, // Jarak antar slice
        cutout: "70%", // Lubang tengah
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { family: "'Poppins', sans-serif", size: 11 },
          color: "#a4b0be",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: function (context) {
            if (emptyData) return "Belum ada pengeluaran";
            let label = context.label || "";
            if (label) label += ": ";
            if (context.parsed !== null) {
              label += new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(context.parsed);
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <>
      <h4 className="chart-title">Detail Pengeluaran</h4>
      <div className="chart-wrapper">
        <div style={{ position: "relative", height: "280px", width: "100%" }}>
          <Doughnut data={data} options={options} />

          {/* Ikon di Tengah Lubang Donat */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -60%)",
              pointerEvents: "none",
              color: "#dfe6e9",
              fontSize: "2rem",
              opacity: 0.5,
            }}
          >
            <i className="fas fa-chart-pie"></i>
          </div>
        </div>
      </div>
    </>
  );
};
