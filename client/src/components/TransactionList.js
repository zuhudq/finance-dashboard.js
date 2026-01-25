import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import { formatRupiah } from "../utils/formatRupiah";
import Swal from "sweetalert2";

// Komponen Item Transaksi (Child Component)
const Transaction = ({ transaction }) => {
  const { deleteTransaction, editTransaction } = useContext(GlobalContext);

  // Tentukan tanda +/- dan warna border
  const sign = transaction.amount < 0 ? "-" : "+";
  const amountClass = transaction.amount < 0 ? "minus" : "plus";

  // Format Tanggal (Contoh: 24 Jan 2026)
  const dateObj = new Date(
    transaction.transactionDate || transaction.createdAt,
  );
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Handler Hapus
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus data?",
      text: "Data akan hilang permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d63031",
      cancelButtonColor: "#b2bec3",
      confirmButtonText: "Ya, Hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTransaction(id);
        Swal.fire("Terhapus!", "", "success");
      }
    });
  };

  return (
    <li className={amountClass}>
      <div className="transaction-info">
        <span className="transaction-text">{transaction.text}</span>

        {/* [MODIFIKASI] Bagian Bawah Judul: Kategori & Tanggal */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            fontSize: "0.75rem",
            marginTop: "4px",
            alignItems: "center",
          }}
        >
          {/* Badge Kategori */}
          <span
            className="transaction-cat"
            style={{
              fontWeight: "600",
              color: "#636e72",
              backgroundColor: "#f1f2f6",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            {transaction.category || "Umum"}
          </span>

          <span style={{ color: "#b2bec3" }}>•</span>

          {/* Tanggal */}
          <span style={{ color: "#b2bec3" }}>{formattedDate}</span>
        </div>
      </div>

      <div className="transaction-actions">
        {/* Jumlah Uang */}
        <span className={`amount ${amountClass}`}>
          {sign}
          {formatRupiah(Math.abs(transaction.amount))}
        </span>

        {/* Tombol Edit (Ikon Pensil) */}
        <button
          onClick={() => editTransaction(transaction)}
          className="btn-action edit-btn"
          title="Edit"
        >
          <i className="fas fa-edit"></i>
        </button>

        {/* Tombol Hapus (Silang) */}
        <button
          onClick={() => handleDelete(transaction._id)}
          className="btn-action delete-btn"
          title="Hapus"
        >
          X
        </button>
      </div>
    </li>
  );
};

// --- KOMPONEN UTAMA (LIST) ---
export const TransactionList = () => {
  const { transactions, loading } = useContext(GlobalContext);

  // useEffect untuk ambil data (Hanya dijalankan sekali saat mount)
  // PENTING: Sebenarnya di GlobalState sudah ada auto-fetch,
  // tapi kita pasang di sini juga biar aman saat ganti filter bulan.
  useEffect(() => {
    // Kita tidak perlu panggil getTransactions() di sini kalau GlobalState sudah handle.
    // Tapi untuk keamanan, biarkan saja (tidak error kok).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* LOGIKA EMPTY STATE */}
      {!loading && transactions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "30px",
            color: "#b2bec3",
            border: "2px dashed #dfe6e9",
            borderRadius: "10px",
            marginTop: "10px",
          }}
        >
          <span
            style={{ fontSize: "3rem", display: "block", marginBottom: "10px" }}
          >
            📭
          </span>
          <p style={{ fontSize: "1rem", fontWeight: "500" }}>
            Belum ada transaksi di periode ini.
          </p>
          <small>Yuk tambah transaksi baru!</small>
        </div>
      ) : (
        <ul className="list">
          {transactions.map((transaction) => (
            <Transaction key={transaction._id} transaction={transaction} />
          ))}
        </ul>
      )}
    </>
  );
};
