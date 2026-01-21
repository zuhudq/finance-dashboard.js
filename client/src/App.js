import React from "react";
import "./App.css";
import { Header } from "./components/Header";
import { Balance } from "./components/Balance";
import { IncomeExpenses } from "./components/IncomeExpenses";
import { TransactionList } from "./components/TransactionList";
import { AddTransaction } from "./components/AddTransaction";
import { IncomeExpenseChart } from "./components/IncomeExpenseChart";
import { ExpenseChart } from "./components/ExpenseChart";
import { MonthFilter } from "./components/MonthFilter"; // Pastikan file ini sudah dibuat

import { GlobalProvider } from "./context/GlobalState";

function App() {
  return (
    <GlobalProvider>
      <div className="container">
        <Header />

        {/* [MODIFIKASI] Menambahkan Filter Bulan Di Sini */}
        {/* Posisi strategis: Di bawah Judul, Di atas Saldo */}
        <MonthFilter />
        {/* ------------------------------------------- */}

        {/* BARIS 1: KARTU SALDO & RINGKASAN */}
        <div className="dashboard-row summary-row">
          <div className="balance-card">
            <Balance />
          </div>
          <div className="inc-exp-card">
            <IncomeExpenses />
          </div>
        </div>

        {/* BARIS 2: AREA GRAFIK */}
        <div className="dashboard-row charts-row">
          <div className="chart-card">
            <IncomeExpenseChart />
          </div>
          <div className="chart-card">
            <ExpenseChart />
          </div>
        </div>

        {/* BARIS 3: RIWAYAT & FORM (SPLIT VIEW) */}
        <div className="dashboard-row content-row">
          <div className="history-section">
            <TransactionList />
          </div>
          <div className="form-section">
            <AddTransaction />
          </div>
        </div>
      </div>
    </GlobalProvider>
  );
}

export default App;
