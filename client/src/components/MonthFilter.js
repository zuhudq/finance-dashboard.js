import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatRupiah } from "../utils/formatRupiah";

export const MonthFilter = () => {
  // Ambil state dan data dari GlobalContext
  const { dateFilter, setDateFilter, transactions } = useContext(GlobalContext);

  // --- FUNGSI GENERATE PDF ---
  const generatePDF = () => {
    // 1. Inisialisasi Dokumen PDF
    const doc = new jsPDF();

    // 2. Header & Judul
    doc.setFontSize(18);
    doc.text("Laporan Keuangan", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);

    // Format Nama Periode (misal: "Januari 2026")
    const periodeName = dateFilter
      ? new Date(dateFilter).toLocaleString("id-ID", {
          month: "long",
          year: "numeric",
        })
      : "Semua Waktu";

    doc.text(`Periode: ${periodeName}`, 14, 30);

    // 3. Hitung Ringkasan Saldo (Khusus yang tampil di layar saat ini)
    const totalIncome = transactions
      .filter((t) => t.amount > 0)
      .reduce((acc, item) => (acc += item.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.amount < 0)
      .reduce((acc, item) => (acc += item.amount), 0);

    const balance = totalIncome + totalExpense;

    // Tampilkan Ringkasan di PDF
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Saldo Akhir: ${formatRupiah(balance)}`, 14, 40);
    doc.text(`Total Pemasukan: ${formatRupiah(totalIncome)}`, 14, 45);
    doc.text(
      `Total Pengeluaran: ${formatRupiah(Math.abs(totalExpense))}`,
      14,
      50,
    );

    // 4. Siapkan Data Tabel
    const tableColumn = ["Tanggal", "Keterangan", "Kategori", "Jumlah"];
    const tableRows = [];

    transactions.forEach((transaction) => {
      // Format Tanggal (24 Jan 2026)
      const dateRaw = transaction.transactionDate || transaction.createdAt;
      const transactionDate = new Date(dateRaw).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const amountData = formatRupiah(transaction.amount);

      // [PENTING] Fallback kategori: Jika kosong, tulis "Umum"
      const categoryData = transaction.category || "Umum";

      const rowData = [
        transactionDate,
        transaction.text,
        categoryData,
        amountData,
      ];
      tableRows.push(rowData);
    });

    // 5. Generate Tabel (AutoTable)
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55, // Mulai di bawah summary
      theme: "grid",
      headStyles: {
        fillColor: [108, 92, 231], // Warna Ungu Tema Kita
        textColor: 255,
      },
      styles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 246, 250] }, // Zebra Stripe halus
    });

    // 6. Download File
    doc.save(`Laporan_Keuangan_${periodeName}.pdf`);
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <label style={{ fontWeight: "bold", color: "#2d3436" }}>Periode:</label>

      {/* INPUT BULAN */}
      <input
        type="month"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #dfe6e9",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      />

      {/* TOMBOL RESET (SEMUA) */}
      <button
        onClick={() => setDateFilter("")}
        style={{
          padding: "8px 15px",
          borderRadius: "8px",
          border: "none",
          background: dateFilter === "" ? "#6c5ce7" : "#dfe6e9",
          color: dateFilter === "" ? "#fff" : "#636e72",
          cursor: "pointer",
          fontWeight: "600",
          transition: "0.3s",
        }}
      >
        Semua
      </button>

      {/* TOMBOL DOWNLOAD PDF */}
      <button
        onClick={generatePDF}
        style={{
          padding: "8px 15px",
          borderRadius: "8px",
          border: "none",
          background: "#00b894", // Hijau Mint
          color: "#fff",
          cursor: "pointer",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        <i className="fas fa-file-download"></i> Download PDF
      </button>
    </div>
  );
};
