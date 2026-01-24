import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import Swal from "sweetalert2";

export const AddTransaction = () => {
  // --- 1. STATE DEFINITION (Kumpulkan semua di atas biar rapi) ---
  const [text, setText] = useState("");
  // amount disimpan sebagai string agar bisa menampung format "10.000"
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Lainnya");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  // State untuk Toggle (Default: Pengeluaran biar cepat input jajan)
  const [transactionType, setTransactionType] = useState("expense");

  const { addTransaction, currentTransaction, updateTransaction, clearEdit } =
    useContext(GlobalContext);

  // --- 2. EFFECT: ISI FORM SAAT EDIT ---
  useEffect(() => {
    if (currentTransaction !== null) {
      // Jika sedang Edit Data
      setText(currentTransaction.text);

      // Ambil angka positifnya saja untuk ditampilkan di input (misal -50000 jadi "50.000")
      setAmount(formatNumber(Math.abs(currentTransaction.amount)));

      setCategory(currentTransaction.category || "Lainnya");

      // Format Tanggal
      const formattedDate = currentTransaction.transactionDate
        ? new Date(currentTransaction.transactionDate)
            .toISOString()
            .split("T")[0]
        : new Date(currentTransaction.createdAt).toISOString().split("T")[0];
      setDate(formattedDate);

      // [LOGIKA PENTING] Deteksi apakah ini Pemasukan atau Pengeluaran
      setTransactionType(currentTransaction.amount < 0 ? "expense" : "income");
    } else {
      // Jika Reset / Tambah Baru
      setText("");
      setAmount("");
      setCategory("Lainnya");
      setDate(new Date().toISOString().split("T")[0]);
      setTransactionType("expense");
    }
  }, [currentTransaction]);

  // --- 3. HELPER: FORMAT ANGKA (1000 -> 1.000) ---
  const formatNumber = (num) => {
    if (!num) return "";
    return num
      .toString()
      .replace(/\D/g, "") // Hapus karakter selain angka
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Pasang titik
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const formatted = formatNumber(value);
    setAmount(formatted);
  };

  // --- 4. SUBMIT HANDLER ---
  // [FIX] Tambahkan async di sini
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!text || !amount) {
      Swal.fire({ icon: "warning", text: "Mohon isi keterangan dan jumlah!" });
      return;
    }

    const rawAmount = +amount.replaceAll(".", "");
    const finalAmount = transactionType === "expense" ? -rawAmount : rawAmount;

    const transactionData = {
      text,
      amount: finalAmount,
      category,
      transactionDate: date,
    };

    try {
      if (currentTransaction !== null) {
        // [FIX] Tambahkan await biar nunggu server selesai dulu
        await updateTransaction(currentTransaction._id, transactionData);
        clearEdit();
        Swal.fire({
          icon: "success",
          title: "Berhasil Diupdate!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // [FIX] Tambahkan await di sini juga
        await addTransaction(transactionData);
        Swal.fire({
          icon: "success",
          title: "Berhasil Ditambahkan!",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      // Reset Form HANYA jika sukses
      setText("");
      setAmount("");
      setCategory("Lainnya");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      // Kalau error, SweetAlert sukses tidak akan muncul, form tidak ter-reset
      console.error("Gagal simpan:", error);
    }
  };

  const onCancel = () => {
    clearEdit();
    // State akan direset otomatis oleh useEffect karena currentTransaction jadi null
  };

  return (
    <>
      <h3
        style={{
          borderBottom: "2px solid #f0f0f0",
          paddingBottom: "10px",
          color: "#2d3436",
        }}
      >
        {currentTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}
      </h3>

      <form onSubmit={onSubmit}>
        {/* INPUT TANGGAL */}
        <div className="form-control">
          <label htmlFor="date">Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* INPUT KETERANGAN */}
        <div className="form-control">
          <label htmlFor="text">Keterangan</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contoh: Gaji, Nasi Goreng, Bensin..."
          />
        </div>

        {/* INPUT KATEGORI */}
        <div className="form-control">
          <label htmlFor="category">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
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

        {/* --- FITUR TOGGLE & JUMLAH --- */}
        <div className="form-control">
          <label>Jenis & Jumlah</label>

          {/* 1. Toggle Pemasukan / Pengeluaran */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div
              onClick={() => setTransactionType("expense")}
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                background:
                  transactionType === "expense" ? "#e74c3c" : "#ecf0f1",
                color: transactionType === "expense" ? "#fff" : "#2d3436",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                border:
                  transactionType === "expense" ? "none" : "1px solid #dfe6e9",
                transition: "all 0.3s",
              }}
            >
              Pengeluaran
            </div>
            <div
              onClick={() => setTransactionType("income")}
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                background:
                  transactionType === "income" ? "#2ecc71" : "#ecf0f1",
                color: transactionType === "income" ? "#fff" : "#2d3436",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                border:
                  transactionType === "income" ? "none" : "1px solid #dfe6e9",
                transition: "all 0.3s",
              }}
            >
              Pemasukan
            </div>
          </div>

          {/* 2. Input Duit Cantik */}
          <div className="input-group" style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontWeight: "bold",
                color: "#b2bec3",
              }}
            >
              Rp
            </span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              style={{ paddingLeft: "40px" }} // Kasih jarak biar gak numpuk sama Rp
            />
          </div>
        </div>

        {/* TOMBOL AKSI */}
        <div className="form-actions" style={{ marginTop: "20px" }}>
          <button
            className="btn"
            style={{
              width: "100%",
              backgroundColor: currentTransaction ? "#f39c12" : "#6c5ce7",
              marginBottom: "10px",
            }}
          >
            {currentTransaction ? "Update Transaksi" : "Tambah Transaksi"}
          </button>

          {currentTransaction && (
            <button
              type="button"
              onClick={onCancel}
              className="btn"
              style={{ width: "100%", backgroundColor: "#95a5a6" }}
            >
              Batal Edit
            </button>
          )}
        </div>
      </form>
    </>
  );
};
