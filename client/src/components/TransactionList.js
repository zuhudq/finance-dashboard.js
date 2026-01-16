import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

// Kita buat komponen kecil untuk merapikan item (Transaction Item)
// Biar codingan di bawah nggak kepanjangan
const Transaction = ({ transaction }) => {
  const { deleteTransaction } = useContext(GlobalContext);

  const sign = transaction.amount < 0 ? "-" : "+";

  return (
    <li className={transaction.amount < 0 ? "minus" : "plus"}>
      {transaction.text}
      <span>
        {sign}Rp {Math.abs(transaction.amount)}
      </span>
      <button
        onClick={() => deleteTransaction(transaction.id)}
        className="delete-btn"
      >
        x
      </button>
    </li>
  );
};

export const TransactionList = () => {
  // Ambil data transactions dari Global Context
  const { transactions } = useContext(GlobalContext);

  return (
    <>
      <h3>Riwayat Transaksi</h3>
      <ul className="list">
        {transactions.map((transaction) => (
          <Transaction key={transaction.id} transaction={transaction} />
        ))}
      </ul>
    </>
  );
};
