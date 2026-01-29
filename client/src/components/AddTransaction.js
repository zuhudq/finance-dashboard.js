import React, { useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import Swal from "sweetalert2";

export const AddTransaction = () => {
  const { addTransaction } = useContext(GlobalContext);

  const [text, setText] = useState("");
  const [amount, setAmount] = useState(0);
  const [amountRaw, setAmountRaw] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // [BARU] State untuk Recurring
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("Bulanan");

  const onSubmit = (e) => {
    e.preventDefault();

    if (!text || !amountRaw) {
      Swal.fire("Eits!", "Isi dulu keterangan dan jumlahnya ya.", "warning");
      return;
    }

    // Tentukan tanda plus/minus
    // Jika user klik tombol "Pengeluaran" (diwakili UI nanti), kita set negatif
    // Disini kita pakai logika sederhana: user input angka, kita yang atur
    // Untuk mempermudah, kita anggap inputan user positif, nanti tombol yang menentukan

    // Tapi karena layout lama kita input manual, kita ikuti flow yang ada:
    // User input -20000 atau 20000
    // Biar lebih UX friendly, kita buat input angka selalu positif,
    // lalu ada tombol toggle "Pemasukan / Pengeluaran"
  };

  // Kitarombak flow formnya biar lebih modern (Tanpa ketik minus manual)
  const [type, setType] = useState("expense"); // 'expense' or 'income'

  const handleAmountChange = (e) => {
    const val = e.target.value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmountRaw(val);
    setAmount(parseInt(val.replace(/\./g, "")) || 0);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    const finalAmount =
      type === "expense" ? -Math.abs(amount) : Math.abs(amount);

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text: isRecurring ? `${text} (Rutin ${frequency})` : text, // Tandai di teks
      amount: finalAmount,
      category,
      transactionDate: date,
      // Di backend nanti bisa ditambah field 'isRecurring'
    };

    addTransaction(newTransaction);

    // Reset
    setText("");
    setAmount(0);
    setAmountRaw("");
    setIsRecurring(false);

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Transaksi berhasil dicatat.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <form onSubmit={handleFinalSubmit}>
      {/* 1. TANGGAL */}
      <div className="form-control">
        <label>Tanggal</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* 2. JENIS (TOGGLE BUTTON) */}
      <div className="form-control">
        <label>Jenis Transaksi</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <div
            onClick={() => setType("expense")}
            style={{
              flex: 1,
              padding: "12px",
              textAlign: "center",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              background:
                type === "expense" ? "var(--danger)" : "var(--input-bg)",
              color: type === "expense" ? "white" : "var(--text-secondary)",
              border: "1px solid var(--border-color)",
              transition: "0.3s",
            }}
          >
            Pengeluaran 💸
          </div>
          <div
            onClick={() => setType("income")}
            style={{
              flex: 1,
              padding: "12px",
              textAlign: "center",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              background:
                type === "income" ? "var(--success)" : "var(--input-bg)",
              color: type === "income" ? "white" : "var(--text-secondary)",
              border: "1px solid var(--border-color)",
              transition: "0.3s",
            }}
          >
            Pemasukan 💰
          </div>
        </div>
      </div>

      {/* 3. KETERANGAN */}
      <div className="form-control">
        <label>Keterangan</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Contoh: Nasi Goreng, Gaji..."
        />
      </div>

      {/* 4. JUMLAH (INPUT RP) */}
      <div className="form-control">
        <label>Nominal (Rp)</label>
        <input
          type="text"
          value={amountRaw}
          onChange={handleAmountChange}
          placeholder="0"
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: type === "expense" ? "var(--danger)" : "var(--success)",
          }}
        />
      </div>

      {/* 5. KATEGORI */}
      <div className="form-control">
        <label>Kategori</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Makanan">🍔 Makanan</option>
          <option value="Transport">🚗 Transport</option>
          <option value="Tagihan">🏠 Tagihan</option>
          <option value="Hiburan">🎬 Hiburan</option>
          <option value="Belanja">🛍️ Belanja</option>
          <option value="Kesehatan">💊 Kesehatan</option>
          <option value="Gaji">💵 Gaji</option>
          <option value="Investasi">📈 Investasi</option>
          <option value="Lainnya">⚪ Lainnya</option>
        </select>
      </div>

      {/* 6. [BARU] RECURRING OPTION */}
      <div
        className="form-control"
        style={{
          background: "rgba(108, 92, 231, 0.05)",
          padding: "15px",
          borderRadius: "10px",
          border: "1px dashed var(--primary)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <label
            style={{
              margin: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              style={{
                width: "20px",
                height: "20px",
                accentColor: "var(--primary)",
              }}
            />
            <span>🔄 Jadikan Rutin?</span>
          </label>

          {isRecurring && (
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={{ width: "auto", padding: "5px 10px", fontSize: "0.9rem" }}
            >
              <option value="Harian">Harian</option>
              <option value="Mingguan">Mingguan</option>
              <option value="Bulanan">Bulanan</option>
            </select>
          )}
        </div>
        {isRecurring && (
          <small
            style={{
              display: "block",
              marginTop: "5px",
              color: "var(--text-secondary)",
            }}
          >
            *Transaksi ini akan ditandai sebagai rutin.
          </small>
        )}
      </div>

      <button className="btn">Tambah Transaksi</button>
    </form>
  );
};
