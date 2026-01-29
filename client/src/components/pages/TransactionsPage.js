import React from "react";
import { TransactionList } from "../TransactionList";
import { AddTransaction } from "../AddTransaction";
import { TransactionSearch } from "../TransactionSearch";

export const TransactionsPage = () => {
  return (
    <div className="dashboard-row content-row animate-fade-in">
      <div className="history-section">
        <h3>Riwayat Transaksi</h3>
        <TransactionSearch />
        <TransactionList />
      </div>
      <div className="form-section">
        <h3>Tambah Baru</h3>
        <AddTransaction />
      </div>
    </div>
  );
};
