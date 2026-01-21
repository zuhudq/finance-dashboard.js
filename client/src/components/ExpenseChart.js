import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { GlobalContext } from "../context/GlobalState";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const ExpenseChart = () => {
  const { transactions } = useContext(GlobalContext);

  // 1. Ambil hanya Pengeluaran (Angka Negatif)
  const expenses = transactions.filter((transaction) => transaction.amount < 0);

  // 2. Daftar Kategori & Warna Tetap
  // Biar warnanya konsisten: Makanan selalu oranye, Transport selalu biru, dst.
  const categoryConfig = {
    Makanan: { color: "#e67e22", label: "🍔 Makanan" }, // Carrot Orange
    Transport: { color: "#3498db", label: "🚗 Transport" }, // Peter River Blue
    Tagihan: { color: "#9b59b6", label: "🏠 Tagihan" }, // Amethyst Purple
    Hiburan: { color: "#f1c40f", label: "🎬 Hiburan" }, // Sunflower Yellow
    Gaji: { color: "#2ecc71", label: "💰 Gaji" }, // Emerald Green
    Lainnya: { color: "#95a5a6", label: "🔹 Lainnya" }, // Concrete Gray
  };

  // 3. Logika Grouping: Hitung total per kategori
  // Kita siapkan objek kosong untuk menampung total
  const expenseTotals = {};

  expenses.forEach((transaction) => {
    const cat = transaction.category || "Lainnya"; // Jaga-jaga kalau kategori kosong
    const amount = Math.abs(transaction.amount); // Kita butuh angka positif buat grafik

    if (expenseTotals[cat]) {
      expenseTotals[cat] += amount;
    } else {
      expenseTotals[cat] = amount;
    }
  });

  // 4. Siapkan Data untuk Chart.js
  // Kita ambil label (nama kategori) yang ada datanya saja
  const labels = Object.keys(expenseTotals);
  const dataValues = Object.values(expenseTotals);

  // Ambil warna berdasarkan kategori yang muncul
  const backgroundColors = labels.map((cat) =>
    categoryConfig[cat] ? categoryConfig[cat].color : "#ccc",
  );
  const borderColors = labels.map(() => "#ffffff"); // Border putih biar rapi

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Pengeluaran (Rp)",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20, // [BARU] Sama, tambahkan padding
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: { display: false },
    },
  };

  if (expenses.length === 0) return null;

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">Detail Pengeluaran</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
};
