import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";

export const AddTransaction = () => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState(0);

  // 1. Ambil state dan fungsi baru dari Context
  const { addTransaction, currentTransaction, updateTransaction, clearEdit } =
    useContext(GlobalContext);

  // 2. useEffect: Memantau perubahan "currentTransaction"
  useEffect(() => {
    if (currentTransaction !== null) {
      setText(currentTransaction.text);
      setAmount(currentTransaction.amount);
    } else {
      setText("");
      setAmount(0);
    }
  }, [currentTransaction]);

  const onSubmit = (e) => {
    e.preventDefault();

    // 3. Cek: Kita lagi mode Edit atau mode Tambah?
    if (currentTransaction !== null) {
      // --- LOGIKA EDIT (UPDATE) ---
      const updatedTransaction = {
        text,
        amount: +amount,
      };

      // Panggil fungsi Update API
      updateTransaction(currentTransaction._id, updatedTransaction);

      // Keluar dari mode edit
      clearEdit();
    } else {
      // --- LOGIKA TAMBAH (CREATE) ---
      const newTransaction = {
        text,
        amount: +amount,
      };

      addTransaction(newTransaction);
    }

    // Reset Form
    setText("");
    setAmount(0);
  };

  // Fungsi untuk batal edit
  const onCancel = () => {
    clearEdit();
    setText("");
    setAmount(0);
  };

  return (
    <>
      {/* Judul berubah dinamis */}
      <h3>{currentTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}</h3>

      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="text">Keterangan</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contoh: Gaji..."
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

        {/* --- BAGIAN INI YANG KITA RAPIKAN --- */}
        {/* Kita bungkus tombol dalam div 'form-actions' biar sejajar */}
        <div className="form-actions">
          <button
            className="btn"
            style={{
              backgroundColor: currentTransaction ? "#f39c12" : "#9c88ff",
            }}
          >
            {currentTransaction ? "Update Transaksi" : "Tambah Transaksi"}
          </button>

          {/* Tombol Batal cuma muncul pas edit */}
          {currentTransaction && (
            <button type="button" onClick={onCancel} className="btn btn-cancel">
              Batal
            </button>
          )}
        </div>
        {/* ------------------------------------ */}
      </form>
    </>
  );
};
