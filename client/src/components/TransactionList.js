import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";

// Komponen Item Kecil
const Transaction = ({ transaction }) => {
  const { deleteTransaction } = useContext(GlobalContext);
  const sign = transaction.amount < 0 ? "-" : "+";

  return (
    <li className={transaction.amount < 0 ? "minus" : "plus"}>
      {transaction.text}
      <span>
        {sign}Rp {Math.abs(transaction.amount)}
      </span>
      {/* Perhatikan: Kita pakai _id karena MongoDB */}
      <button
        onClick={() => deleteTransaction(transaction._id)}
        className="delete-btn"
      >
        x
      </button>
    </li>
  );
};

// Komponen Utama
export const TransactionList = () => {
  const { transactions, getTransactions } = useContext(GlobalContext);

  // Panggil fungsi ambil data saat pertama kali load
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
