import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // [UBAH 1] Import sebagai autoTable
import { formatRupiah } from "../utils/formatRupiah";

export const MonthFilter = () => {
  const { dateFilter, setDateFilter, transactions } = useContext(GlobalContext);

  const generatePDF = () => {
    // 1. Siapkan Dokumen
    const doc = new jsPDF();

    // 2. Judul Laporan
    doc.setFontSize(18);
    doc.text("Laporan Keuangan", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    // Format tanggal cantik
    const periode = dateFilter
      ? new Date(dateFilter).toLocaleString("id-ID", {
          month: "long",
          year: "numeric",
        })
      : "Semua Waktu";
    doc.text(`Periode: ${periode}`, 14, 30);

    // 3. Ringkasan Saldo
    const totalIncome = transactions
      .filter((t) => t.amount > 0)
      .reduce((acc, item) => (acc += item.amount), 0);
    const totalExpense = transactions
      .filter((t) => t.amount < 0)
      .reduce((acc, item) => (acc += item.amount), 0);
    const balance = totalIncome + totalExpense;

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
      // Handle tanggal fallback
      const dateRaw = transaction.transactionDate || transaction.createdAt;
      const transactionDate = new Date(dateRaw).toLocaleDateString("id-ID");

      const amountData = formatRupiah(transaction.amount);

      const transactionData = [
        transactionDate,
        transaction.text,
        transaction.category,
        amountData,
      ];
      tableRows.push(transactionData);
    });

    // 5. [UBAH 2] Generate Tabel dengan Syntax Baru
    // Panggil autoTable, lalu masukkan 'doc' sebagai parameter pertama
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: "grid",
      headStyles: { fillColor: [108, 92, 231] }, // Warna Ungu
    });

    // 6. Simpan File
    doc.save(`Laporan_Keuangan_${dateFilter || "All"}.pdf`);
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
        }}
      >
        Semua
      </button>

      <button
        onClick={generatePDF}
        style={{
          padding: "8px 15px",
          borderRadius: "8px",
          border: "none",
          background: "#00b894",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <i className="fas fa-file-download"></i> Download PDF
      </button>
    </div>
  );
};
