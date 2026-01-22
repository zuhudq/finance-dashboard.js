import React from "react";
import { Header } from "./Header";
import { Balance } from "./Balance";
import { IncomeExpenses } from "./IncomeExpenses";
import { TransactionList } from "./TransactionList";
import { AddTransaction } from "./AddTransaction";
import { IncomeExpenseChart } from "./IncomeExpenseChart";
import { ExpenseChart } from "./ExpenseChart";
import { MonthFilter } from "./MonthFilter";

export const Dashboard = () => {
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
