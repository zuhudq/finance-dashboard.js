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

  // --- DATABASE TIPS PINTAR (UPDATE LENGKAP) ---
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
    // [KATEGORI BARU]
    Belanja: [
      "💡 Tunggu diskon tanggal kembar (9.9, 12.12) biar lebih murah!",
      "💡 Jangan lapar mata, beli yang butuh saja bukan yang lucu.",
      "💡 Bandingkan harga di 3 marketplace berbeda sebelum checkout.",
      "💡 Hapus aplikasi belanja kalau tangan gatal ingin checkout terus.",
    ],
    Kesehatan: [
      "💡 Mencegah lebih baik daripada mengobati, yuk olahraga!",
      "💡 Manfaatkan BPJS atau asuransi kantor semaksimal mungkin.",
      "💡 Kurangi begadang dan makan junk food, investasi tubuh jangka panjang.",
      "💡 Beli obat generik, kandungannya sama harganya jauh lebih hemat.",
    ],
    Investasi: [
      "💡 Jangan FOMO saham gorengan, pelajari fundamentalnya!",
      "💡 Rutin nabung emas/reksa dana sedikit-sedikit lama-lama jadi bukit.",
      "💡 Diversifikasi aset, jangan taruh telur dalam satu keranjang.",
      "💡 Ingat, investasi itu lari maraton bukan lari sprint.",
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

  // --- LOGIKA HITUNG ---
  const calculateProgress = (catName, budgetLimit) => {
    const expenses = transactions
      .filter((t) => t.amount < 0 && t.category === catName)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const percentRaw = (expenses / budgetLimit) * 100;
    const remaining = budgetLimit - expenses;

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
      percent: Math.min(percentRaw, 100),
      percentText: Math.round(percentRaw),
      remaining,
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
    <div className="budget-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "10px",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>🎯</span>
        <h3 style={{ margin: 0, color: "var(--text-primary)", border: "none" }}>
          Budgeting & Target
        </h3>
      </div>

      <form
        onSubmit={onSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: "10px",
          marginBottom: "30px",
          background: "none",
          padding: 0,
          boxShadow: "none",
        }}
      >
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Makanan">🍔 Makanan</option>
          <option value="Transport">🚗 Transport</option>
          <option value="Tagihan">🏠 Tagihan</option>
          <option value="Hiburan">🎬 Hiburan</option>
          <option value="Belanja">🛍️ Belanja</option>
          <option value="Kesehatan">💊 Kesehatan</option>
          <option value="Investasi">📈 Investasi</option>
          <option value="Lainnya">⚪ Lainnya</option>
        </select>
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Batas (Rp)"
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
              color: "var(--text-secondary)",
              border: "2px dashed var(--border-color)",
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
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                >
                  ×
                </button>

                {/* ROW ATAS */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                    }}
                  >
                    {b.category}
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: isOver ? "#e74c3c" : "var(--text-secondary)",
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

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                      }}
                    >
                      {formatRupiah(expenses)}{" "}
                      <span
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.8rem",
                        }}
                      >
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
                    color: isOver ? "#e74c3c" : "#2ecc71",
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
                    background: "var(--bg-main)", // Adaptif dark mode
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid var(--border-color)",
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
                      background: isOver
                        ? "rgba(231, 76, 60, 0.1)"
                        : "rgba(241, 196, 15, 0.1)", // Transparan biar masuk dark mode
                      color: isOver ? "#e74c3c" : "#f1c40f",
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
