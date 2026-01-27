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
    .reduce((acc, item) => acc + item, 0);

  const expense =
    amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) *
    -1;

  // Jika belum ada data, tampilkan placeholder
  const emptyData = income === 0 && expense === 0;

  const data = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        data: emptyData ? [1] : [income, expense],
        backgroundColor: emptyData
          ? ["#f1f2f6"] // Abu-abu jika kosong
          : ["#00b894", "#ff4757"], // Hijau & Merah Fresh

        // --- RAHASIA 3D MODERN ---
        borderWidth: 0, // Hilangkan garis batas kaku
        hoverOffset: 20, // Efek 3D: Melompat saat di-hover
        borderRadius: 30, // Ujungnya membulat seperti pipa
        spacing: 5, // Ada jarak dikit antar potongan
        cutout: "75%", // Lubang tengah besar (Elegan)
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
          usePointStyle: true, // Ikon bulat, bukan kotak
          padding: 20,
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
          color: "#a4b0be", // Warna teks legend (abu soft)
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: function (context) {
            if (emptyData) return " Belum ada data";
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
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
      <h4 className="chart-title">Analisis Keuangan</h4>
      <div className="chart-wrapper">
        <div style={{ position: "relative", height: "280px", width: "100%" }}>
          <Doughnut data={data} options={options} />

          {/* Teks di Tengah Lubang Donat (Opsional, biar makin kece) */}
          {!emptyData && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              {/* Gunakan var(--text-secondary) agar abu terang di dark mode */}
              <span
                style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
              >
                Balance
              </span>
              <br />
              {/* Gunakan var(--text-primary) agar putih terang di dark mode */}
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "800",
                  color: "var(--text-primary)",
                }}
              >
                {Math.round((income / (income + expense || 1)) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
