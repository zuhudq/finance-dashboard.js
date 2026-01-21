import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";

export const AddTransaction = () => {
  // 1. Tambah State baru untuk Category (Default: Lainnya)
  const [text, setText] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Lainnya");

  // Ambil fungsi dari Context
  const { addTransaction, currentTransaction, updateTransaction, clearEdit } =
    useContext(GlobalContext);

  // 2. Update useEffect: Kalau mode edit, isi kategori juga
  useEffect(() => {
    if (currentTransaction !== null) {
      setText(currentTransaction.text);
      setAmount(currentTransaction.amount);
      // Pakai kategori dari data lama, atau default 'Lainnya' kalau kosong
      setCategory(currentTransaction.category || "Lainnya");
    } else {
      setText("");
      setAmount(0);
      setCategory("Lainnya");
    }
  }, [currentTransaction]);

  const onSubmit = (e) => {
    e.preventDefault();

    if (currentTransaction !== null) {
      // --- LOGIKA UPDATE ---
      const updatedTransaction = {
        text,
        amount: +amount,
        category, // Masukkan kategori
      };

      updateTransaction(currentTransaction._id, updatedTransaction);
      clearEdit();
    } else {
      // --- LOGIKA TAMBAH BARU ---
      const newTransaction = {
        text,
        amount: +amount,
        category, // Masukkan kategori
      };

      addTransaction(newTransaction);
    }

    // Reset Form ke awal
    setText("");
    setAmount(0);
    setCategory("Lainnya");
  };

  const onCancel = () => {
    clearEdit();
    setText("");
    setAmount(0);
    setCategory("Lainnya");
  };

  return (
    <>
      <h3>{currentTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}</h3>

      <form onSubmit={onSubmit}>
        {/* INPUT TEKS */}
        <div className="form-control">
          <label htmlFor="text">Keterangan</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contoh: Gaji, Bensin..."
          />
        </div>

        {/* INPUT KATEGORI (DROPDOWN) - INI YANG BARU */}
        <div className="form-control">
          <label htmlFor="category">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #dedede",
              backgroundColor: "#fff",
              fontSize: "16px",
            }}
          >
            <option value="Lainnya">Pilih Kategori...</option>
            <option value="Gaji">💰 Gaji</option>
            <option value="Makanan">🍔 Makanan</option>
            <option value="Transport">🚗 Transport</option>
            <option value="Tagihan">🏠 Tagihan</option>
            <option value="Hiburan">🎬 Hiburan</option>
            <option value="Lainnya">🔹 Lainnya</option>
          </select>
        </div>

        {/* INPUT JUMLAH */}
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

        {/* TOMBOL AKSI */}
        <div className="form-actions">
          <button
            className="btn"
            style={{
              backgroundColor: currentTransaction ? "#f39c12" : "#9c88ff",
            }}
          >
            {currentTransaction ? "Update Transaksi" : "Tambah Transaksi"}
          </button>

          {currentTransaction && (
            <button type="button" onClick={onCancel} className="btn btn-cancel">
              Batal
            </button>
          )}
        </div>
      </form>
    </>
  );
};
