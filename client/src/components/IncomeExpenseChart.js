import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { GlobalContext } from "../context/GlobalState";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Wajib: Mendaftarkan elemen grafik Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export const IncomeExpenseChart = () => {
  const { transactions } = useContext(GlobalContext);

  // 1. Ambil Angka Pemasukan & Pengeluaran
  const amounts = transactions.map((transaction) => transaction.amount);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0);

  const expense =
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1;

  // 2. Setting Data Grafik
  const data = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        label: "Jumlah (Rp)",
        data: [income, expense], // Masukkan data hasil hitungan
        backgroundColor: [
          "#2ecc71", // Hijau (Pemasukan)
          "#c0392b", // Merah (Pengeluaran)
        ],
        borderColor: ["#2ecc71", "#c0392b"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20, // [BARU] Menambahkan jarak 20px dari tepi, biar donat mengecil
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: { padding: 20 },
      },
    },
  };

  // Kalau belum ada transaksi, jangan tampilkan grafik kosong yang jelek
  if (income === 0 && expense === 0) {
    return (
      <p style={{ textAlign: "center", color: "#777", margin: "20px 0" }}>
        Belum ada data untuk grafik.
      </p>
    );
  }

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">Analisis Keuangan</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
};
