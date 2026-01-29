import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalState"; // Import Context
import { Balance } from "../Balance";
import { IncomeExpenses } from "../IncomeExpenses";
import { IncomeExpenseChart } from "../IncomeExpenseChart";
import { ExpenseChart } from "../ExpenseChart";

export const DashboardPage = () => {
  const { getTransactions, getBudgets } = useContext(GlobalContext);

  // [FIX] Panggil data saat halaman ini dimuat
  useEffect(() => {
    getTransactions();
    getBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ textAlign: "left", margin: 0 }}>Ringkasan Keuangan</h2>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Pantau arus kasmu di sini
        </p>
      </div>

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
    </div>
  );
};
