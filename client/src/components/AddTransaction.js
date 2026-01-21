import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import Swal from "sweetalert2";

export const AddTransaction = () => {
  const [text, setText] = useState("");

  // [UBAH] amount sekarang string biar bisa simpan titik "5.000"
  const [amount, setAmount] = useState("");

  const [category, setCategory] = useState("Lainnya");
  const [date, setDate] = useState("");

  const { addTransaction, currentTransaction, updateTransaction, clearEdit } =
    useContext(GlobalContext);

  useEffect(() => {
    if (currentTransaction !== null) {
      setText(currentTransaction.text);

      // [LOGIKA EDIT] Ubah angka murni (6500000) jadi format cantik ("6.500.000")
      // Kita pakai Math.abs biar tanda negatifnya gak ikut diformat di sini
      setAmount(formatNumber(Math.abs(currentTransaction.amount)));

      setCategory(currentTransaction.category || "Lainnya");
      const formattedDate = currentTransaction.transactionDate
        ? new Date(currentTransaction.transactionDate)
            .toISOString()
            .split("T")[0]
        : new Date().toISOString().split("T")[0];
      setDate(formattedDate);
    } else {
      setText("");
      setAmount(""); // Kosongkan string
      setCategory("Lainnya");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [currentTransaction]);

  // [FUNGSI SAKTI] Format Angka (1000 -> 1.000)
  const formatNumber = (num) => {
    if (!num) return "";
    // Hapus karakter non-digit dulu, lalu kasih titik per 3 digit
    return num
      .toString()
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // [HANDLER] Saat user mengetik angka
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Format on-the-fly
    const formatted = formatNumber(value);
    setAmount(formatted);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // [PENTING] Sebelum kirim ke backend, buang titiknya!
    // "6.500.000" -> 6500000
    const rawAmount = +amount.replaceAll(".", "");

    // Cek jenis transaksi (Pemasukan/Pengeluaran)
    // Di sini kita bisa tambah logika: Kalau kategori "Gaji" otomatis positif?
    // Tapi untuk sekarang, kita biarkan user manual pilih +/- lewat Toggle (Nanti kita bikin toggle)
    // ATAU: Karena input kita sekarang gak bisa negatif (cuma angka),
    // Kita perlu tombol switch "Pemasukan / Pengeluaran".

    // SEMENTARA: Kita anggap defaultnya positif, nanti kita bikin tombol switch.
    // TAPI TUNGGU: Dulu user pakai tanda minus (-) untuk pengeluaran.
    // Karena input type="text" yang diformat sulit pakai minus,
    // Mending kita buat tombol "Jenis Transaksi" di bawah.

    // SOLUSI SEMENTARA YANG AMAN:
    // Biarkan user input angka positif, tapi logika pengeluaran kita handle nanti.
    // (Lihat langkah 3 di instruksi chat selanjutnya untuk tombol switch)

    // Agar aplikasi tetap jalan seperti biasa dulu:
    // Kita pakai trik: Kalau user mengetik "-", anggap pengeluaran?
    // Agak ribet di formatted input.

    // Mari kita buat TOGGLE JENIS di form ini sekalian biar UX nya makin mantap!
    const finalAmount = transactionType === "expense" ? -rawAmount : rawAmount;

    const transactionData = {
      text,
      amount: finalAmount, // Pakai hasil logika toggle
      category,
      transactionDate: date,
    };

    if (currentTransaction !== null) {
      updateTransaction(currentTransaction._id, transactionData);
      clearEdit();
      Swal.fire({
        icon: "success",
        title: "Berhasil Diupdate!",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      addTransaction(transactionData);
      Swal.fire({
        icon: "success",
        title: "Berhasil Ditambahkan!",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    setText("");
    setAmount("");
    setCategory("Lainnya");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const onCancel = () => {
    clearEdit();
    setText("");
    setAmount("");
    setCategory("Lainnya");
    setDate(new Date().toISOString().split("T")[0]);
  };

  // [STATE BARU] Untuk Tombol Pemasukan/Pengeluaran
  const [transactionType, setTransactionType] = useState("expense"); // Default Pengeluaran (karena lebih sering input jajan)

  // Efek samping: Kalau lagi edit, deteksi jenisnya
  useEffect(() => {
    if (currentTransaction) {
      setTransactionType(currentTransaction.amount < 0 ? "expense" : "income");
    }
  }, [currentTransaction]);

  return (
    <>
      <h3>{currentTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}</h3>
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
            placeholder="Contoh: Gaji, Bensin..."
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
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #dfe6e9",
              backgroundColor: "#fdfdfd",
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

        {/* [FITUR BARU] INPUT JUMLAH DENGAN FORMAT & TOGGLE */}
        <div className="form-control">
          <label>Jumlah</label>

          {/* 1. Toggle Pemasukan / Pengeluaran */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div
              onClick={() => setTransactionType("expense")}
              style={{
                flex: 1,
                padding: "10px",
                textAlign: "center",
                background:
                  transactionType === "expense" ? "#e74c3c" : "#f0f0f0",
                color: transactionType === "expense" ? "#fff" : "#333",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                border: "1px solid #ddd",
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
                  transactionType === "income" ? "#2ecc71" : "#f0f0f0",
                color: transactionType === "income" ? "#fff" : "#333",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              Pemasukan
            </div>
          </div>

          {/* 2. Input Duit Cantik */}
          <div className="input-group">
            <span className="input-icon">Rp</span>
            <input
              className="money-input"
              type="text" // Harus text biar bisa ada titik
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            className="btn"
            style={{
              backgroundColor: currentTransaction ? "#f39c12" : "#6c5ce7",
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
