import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { formatRupiah } from "../utils/formatRupiah"; // 1. Import ini

export const Balance = () => {
  const { transactions } = useContext(GlobalContext);

  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0);

  return (
    <>
      <h4>Saldo Anda</h4>
      {/* 2. Pakai fungsinya di sini */}
      <h1>{formatRupiah(total)}</h1>
    </>
  );
};
