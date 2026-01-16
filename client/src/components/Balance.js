import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

export const Balance = () => {
  const { transactions } = useContext(GlobalContext);

  // 1. Ambil semua angka (amount) dari transaksi
  const amounts = transactions.map((transaction) => transaction.amount);

  // 2. Jumlahkan semuanya (Rumus Total)
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  return (
    <>
      <h4>Saldo Anda</h4>
      <h1>Rp {total}</h1>
    </>
  );
};
