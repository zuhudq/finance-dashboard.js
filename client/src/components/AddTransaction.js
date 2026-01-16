import React, { useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

export const AddTransaction = () => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState(0);

  const { addTransaction } = useContext(GlobalContext);

  const onSubmit = (e) => {
    e.preventDefault(); // Mencegah halaman refresh sendiri

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000), // Bikin ID acak sementara
      text,
      amount: +amount, // Tanda + untuk memaksa string jadi number
    };

    addTransaction(newTransaction);

    // Reset form setelah submit
    setText("");
    setAmount(0);
  };

  return (
    <>
      <h3>Tambah Transaksi Baru</h3>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="text">Keterangan</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contoh: Gaji, Bayar Listrik..."
          />
        </div>
        <div className="form-control">
          <label htmlFor="amount">
            Jumlah <br />
            (negatif = pengeluaran, positif = pemasukan)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Masukkan angka..."
          />
        </div>
        <button className="btn">Tambah Transaksi</button>
      </form>
    </>
  );
};
