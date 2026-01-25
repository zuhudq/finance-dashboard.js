import React, { useEffect, useContext } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { Header } from "./Header";
import { Balance } from "./Balance";
import { IncomeExpenses } from "./IncomeExpenses";
import { TransactionList } from "./TransactionList";
import { AddTransaction } from "./AddTransaction";
import { IncomeExpenseChart } from "./IncomeExpenseChart";
import { ExpenseChart } from "./ExpenseChart";
import { MonthFilter } from "./MonthFilter";
// [BARU] Import Komponen Budgeting
import { Budgeting } from "./Budgeting";

import { GlobalContext } from "../context/GlobalState";

export const Dashboard = () => {
  const { getTransactions, transactions, user } = useContext(GlobalContext);

  // Ambil data saat Dashboard dimuat
  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- FUNGSI DOWNLOAD PDF ---
  const generatePDF = () => {
    const doc = new jsPDF();

    // Judul
    doc.setFontSize(18);
    doc.text("Laporan Keuangan", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    // Tampilkan Nama User jika ada
    doc.text(`User: ${user ? user.name : "Pengguna"}`, 14, 30);
    doc.text(
      `Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`,
      14,
      36,
    );

    // Tabel Data
    const tableColumn = ["Tanggal", "Keterangan", "Kategori", "Jumlah"];
    const tableRows = [];

    transactions.forEach((t) => {
      // Format Tanggal
      const dateRaw = t.transactionDate || t.createdAt;
      const formattedDate = new Date(dateRaw).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const tData = [
        formattedDate,
        t.text,
        t.category || "Umum",
        `Rp ${t.amount.toLocaleString("id-ID")}`,
      ];
      tableRows.push(tData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: "grid",
      headStyles: { fillColor: [108, 92, 231] },
    });

    const fileName = user
      ? `Laporan_Keuangan_${user.name}.pdf`
      : "Laporan_Keuangan.pdf";
    doc.save(fileName);
  };

  return (
    <div className="container">
      <Header />

      {/* Passing fungsi PDF ke tombol di MonthFilter */}
      <MonthFilter onDownload={generatePDF} />

      <div className="dashboard-row summary-row">
        <div className="balance-card">
          <Balance />
        </div>
        <div className="inc-exp-card">
          <IncomeExpenses />
        </div>
      </div>

      <div className="dashboard-row charts-row">
        <div className="chart-card">
          <IncomeExpenseChart />
        </div>
        <div className="chart-card">
          <ExpenseChart />
        </div>
      </div>

      {/* [BARU] BARIS BUDGETING (Anti Boros) */}
      <div className="dashboard-row">
        <div style={{ flex: 1 }}>
          <Budgeting />
        </div>
      </div>

      <div className="dashboard-row content-row">
        <div className="history-section">
          <TransactionList />
        </div>
        <div className="form-section">
          <AddTransaction />
        </div>
      </div>
    </div>
  );
};
