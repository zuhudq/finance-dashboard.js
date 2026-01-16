import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

export const IncomeExpenses = () => {
  const { transactions } = useContext(GlobalContext);
  const amounts = transactions.map((transaction) => transaction.amount);

  // Rumus Pemasukan (Filter angka positif)
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  // Rumus Pengeluaran (Filter angka negatif)
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  return (
    <div className="inc-exp-container">
      <div>
        <h4>Pemasukan</h4>
        <p className="money plus">+Rp {income}</p>
      </div>
      <div>
        <h4>Pengeluaran</h4>
        <p className="money minus">-Rp {expense}</p>
      </div>
    </div>
  );
};
