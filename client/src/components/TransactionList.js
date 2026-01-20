import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import { formatRupiah } from "../utils/formatRupiah";

const Transaction = ({ transaction }) => {
  const { deleteTransaction, editTransaction } = useContext(GlobalContext);
  const sign = transaction.amount < 0 ? "-" : "+";

  return (
    <li className={transaction.amount < 0 ? "minus" : "plus"}>
      {/* Bagian Kiri: Teks */}
      <span className="transaction-text">{transaction.text}</span>

      {/* Bagian Kanan: Harga & Tombol (Grouping) */}
      <div className="transaction-actions">
        <span className="amount">
          {sign}
          {formatRupiah(Math.abs(transaction.amount))}
        </span>

        <button
          onClick={() => editTransaction(transaction)}
          className="btn-action edit-btn"
          title="Edit Transaksi"
        >
          <i className="fas fa-edit"></i> Edit
        </button>

        <button
          onClick={() => deleteTransaction(transaction._id)}
          className="btn-action delete-btn"
          title="Hapus Transaksi"
        >
          X
        </button>
      </div>
    </li>
  );
};

export const TransactionList = () => {
  const { transactions, getTransactions } = useContext(GlobalContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h3>Riwayat Transaksi</h3>
      <ul className="list">
        {transactions.map((transaction) => (
          <Transaction key={transaction._id} transaction={transaction} />
        ))}
      </ul>
    </>
  );
};
