import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import { formatRupiah } from "../utils/formatRupiah";

const Transaction = ({ transaction }) => {
  const { deleteTransaction, editTransaction } = useContext(GlobalContext);
  const sign = transaction.amount < 0 ? "-" : "+";
  const amountClass = transaction.amount < 0 ? "minus" : "plus"; // Tambahan class warna

  return (
    <li className={amountClass}>
      <div className="transaction-info">
        <span className="transaction-text">{transaction.text}</span>
        {/* Tambahkan class css baru untuk kategori */}
        <span className="transaction-cat">
          {transaction.category || "Umum"}
        </span>
      </div>

      <div className="transaction-actions">
        {/* Tambahkan class warna pada angka */}
        <span className={`amount ${amountClass}`}>
          {sign}
          {formatRupiah(Math.abs(transaction.amount))}
        </span>

        <button
          onClick={() => editTransaction(transaction)}
          className="btn-action edit-btn"
          title="Edit"
        >
          <i className="fas fa-edit"></i> Edit
        </button>
        <button
          onClick={() => deleteTransaction(transaction._id)}
          className="btn-action delete-btn"
          title="Hapus"
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
