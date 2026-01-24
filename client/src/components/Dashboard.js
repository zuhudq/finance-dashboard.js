import React, { useEffect, useContext } from "react"; // Tambah useEffect & useContext
import { Header } from "./Header";
import { Balance } from "./Balance";
import { IncomeExpenses } from "./IncomeExpenses";
import { TransactionList } from "./TransactionList";
import { AddTransaction } from "./AddTransaction";
import { IncomeExpenseChart } from "./IncomeExpenseChart";
import { ExpenseChart } from "./ExpenseChart";
import { MonthFilter } from "./MonthFilter";

import { GlobalContext } from "../context/GlobalState";

export const Dashboard = () => {
  // Ambil fungsi getTransactions dari GlobalContext
  const { getTransactions } = useContext(GlobalContext);

  // [PENTING] Panggil data transaksi setiap kali Dashboard dibuka
  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <Header />

      <MonthFilter />

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
