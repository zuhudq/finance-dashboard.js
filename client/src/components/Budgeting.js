import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import { formatRupiah } from "../utils/formatRupiah";
import Swal from "sweetalert2";

export const Budgeting = () => {
  const { transactions, budgets, getBudgets, setBudget, deleteBudget } =
    useContext(GlobalContext);

  const [category, setCategory] = useState("Makanan");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    getBudgets();
    // eslint-disable-next-line
  }, []);

  // --- DATABASE TIPS PINTAR ---
  const smartTips = {
    Makanan: [
      "💡 Masak sendiri jauh lebih hemat daripada GoFood terus!",
      "💡 Bawa bekal ke kantor/kampus bisa hemat ratusan ribu lho.",
      "💡 Kurangi jajan kopi kekinian, coba bikin kopi sendiri.",
      "💡 Belanja bahan makanan mingguan di pasar tradisional lebih murah.",
    ],
    Transport: [
      "💡 Coba naik transportasi umum sesekali, lebih hemat bensin.",
      "💡 Cek tekanan ban, ban kempes bikin boros BBM!",
      "💡 Jalan kaki untuk jarak dekat, sehat dan gratis.",
      "💡 Nebeng teman atau carpooling bisa jadi solusi hemat.",
    ],
    Tagihan: [
      "💡 Matikan lampu dan AC jika tidak dipakai.",
      "💡 Cek langganan (Netflix/Spotify) yang jarang dipakai, unsubscribe!",
      "💡 Gunakan air secukupnya, jangan biarkan keran menetes.",
      "💡 Bayar tagihan tepat waktu biar gak kena denda.",
    ],
    Hiburan: [
      "💡 Cari hiburan gratis di taman kota atau perpustakaan.",
      "💡 Nonton film di rumah lebih hemat daripada ke bioskop.",
      "💡 Batasi budget nongkrong tiap minggu.",
      "💡 Cari hobi baru yang tidak menguras dompet.",
    ],
    Lainnya: [
      "💡 Selalu catat pengeluaran kecil, mereka bisa jadi bukit!",
      "💡 Terapkan aturan 'Tunggu 24 Jam' sebelum beli barang keinginan.",
      "💡 Prioritaskan menabung di awal bulan, bukan sisa akhir bulan.",
      "💡 Jual barang bekas yang sudah tidak terpakai.",
    ],
  };

  const getContextualTip = (catName) => {
    const specificTips = smartTips[catName] || smartTips["Lainnya"];
    return specificTips[Math.floor(Math.random() * specificTips.length)];
  };

  // --- LOGIKA HITUNG (UPGRADE) ---
  const calculateProgress = (catName, budgetLimit) => {
    const expenses = transactions
      .filter((t) => t.amount < 0 && t.category === catName)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    // Hitung Persen & Sisa
    const percentRaw = (expenses / budgetLimit) * 100;
    const remaining = budgetLimit - expenses; // Sisa budget

    let color = "#2ecc71"; // Hijau
    let message = "";

    if (percentRaw > 50) color = "#f1c40f"; // Kuning
    if (percentRaw > 80) {
      color = "#e67e22"; // Oranye
      message = "⚠️ Hati-hati! Budget hampir habis.";
    }
    if (percentRaw >= 100) {
      color = "#e74c3c"; // Merah
      message = `🚨 OVER BUDGET! ${getContextualTip(catName)}`;
    }

    return {
      expenses,
      percent: Math.min(percentRaw, 100), // Untuk panjang bar mentok di 100
      percentText: Math.round(percentRaw), // [BARU] Untuk teks (bisa > 100%)
      remaining, // [BARU] Angka sisa
      color,
      isOver: percentRaw >= 100,
      message,
    };
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    const rawAmount = +amount.replaceAll(".", "");
    setBudget({ category, amount: rawAmount });
    Swal.fire({
      icon: "success",
      title: "Target Disimpan!",
      timer: 1000,
      showConfirmButton: false,
    });
    setAmount("");
  };

  const handleAmountChange = (e) => {
    const val = e.target.value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(val);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus target ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya",
    }).then((res) => {
      if (res.isConfirmed) deleteBudget(id);
    });
  };

  return (
    <div
      className="budget-container"
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        marginTop: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>🎯</span>
        <h3 style={{ margin: 0, color: "#2d3436" }}>Budgeting & Target</h3>
      </div>

      <form
        onSubmit={onSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #dfe6e9",
          }}
        >
          <option value="Makanan">🍔 Makanan</option>
          <option value="Transport">🚗 Transport</option>
          <option value="Tagihan">🏠 Tagihan</option>
          <option value="Hiburan">🎬 Hiburan</option>
          <option value="Lainnya">⚪ Lainnya</option>
        </select>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Batas (Rp)"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #dfe6e9",
          }}
        />
        <button
          className="btn"
          style={{ margin: 0, background: "#6c5ce7", whiteSpace: "nowrap" }}
        >
          Set Target
        </button>
      </form>

      <div className="budget-list">
        {budgets.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#b2bec3",
              border: "2px dashed #eee",
              borderRadius: "10px",
            }}
          >
            <p>Belum ada target budget. Yuk setel sekarang!</p>
          </div>
        ) : (
          budgets.map((b) => {
            const {
              expenses,
              percent,
              percentText,
              remaining,
              color,
              isOver,
              message,
            } = calculateProgress(b.category, b.amount);

            return (
              <div
                key={b._id}
                style={{ marginBottom: "25px", position: "relative" }}
              >
                <button
                  onClick={() => handleDelete(b._id)}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: -5,
                    background: "none",
                    border: "none",
                    color: "#ccc",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                >
                  ×
                </button>

                {/* ROW ATAS: Kategori & Persentase */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                    alignItems: "flex-end", // Rata bawah biar rapi
                  }}
                >
                  {/* KIRI: Nama & Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: "600",
                      color: "#2d3436",
                    }}
                  >
                    {b.category}
                    {/* [BARU] Persentase Text */}
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: isOver ? "#e74c3c" : "#b2bec3",
                        fontWeight: "bold",
                      }}
                    >
                      ({percentText}%)
                    </span>
                    {isOver && (
                      <span
                        style={{
                          background: "#e74c3c",
                          color: "white",
                          fontSize: "0.7rem",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        OVER!
                      </span>
                    )}
                  </div>

                  {/* KANAN: Angka Nominal */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>
                      {formatRupiah(expenses)}{" "}
                      <span style={{ color: "#b2bec3", fontSize: "0.8rem" }}>
                        / {formatRupiah(b.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ROW TENGAH: Info Sisa / Minus */}
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "0.8rem",
                    marginBottom: "5px",
                    fontWeight: "600",
                    color: isOver ? "#e74c3c" : "#2ecc71", // Merah kalau minus, Hijau kalau sisa
                  }}
                >
                  {isOver
                    ? `Over: -${formatRupiah(Math.abs(remaining))}`
                    : `Sisa: ${formatRupiah(remaining)}`}
                </div>

                {/* THE BAR */}
                <div
                  style={{
                    width: "100%",
                    height: "12px",
                    background: "#f1f2f6",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background: color,
                      borderRadius: "10px",
                      transition: "width 1s ease-in-out",
                      boxShadow: `0 0 10px ${color}80`,
                    }}
                  ></div>
                </div>

                {/* TIPS / MESSAGE */}
                {message && (
                  <div
                    style={{
                      marginTop: "8px",
                      background: isOver ? "#fff5f5" : "#fffbf0",
                      color: isOver ? "#c0392b" : "#d35400",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      borderLeft: `3px solid ${color}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {message}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
