import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import { formatRupiah } from "../utils/formatRupiah";
import Swal from "sweetalert2";

// Komponen Item Transaksi (Biarkan Kecil di sini)
const Transaction = ({ transaction }) => {
  const { deleteTransaction, editTransaction } = useContext(GlobalContext);
  const sign = transaction.amount < 0 ? "-" : "+";
  const amountClass = transaction.amount < 0 ? "minus" : "plus";

  const dateObj = new Date(
    transaction.transactionDate || transaction.createdAt,
  );
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
        <div
          style={{
            display: "flex",
            gap: "10px",
            fontSize: "0.8rem",
            marginTop: "4px",
          }}
        >
          <span className="transaction-cat" style={{ marginTop: 0 }}>
            {transaction.category || "Umum"}
          </span>
          <span style={{ color: "#b2bec3" }}>•</span>
          <span style={{ color: "#636e72" }}>{formattedDate}</span>
        </div>
      </div>
      <div className="transaction-actions">
        <span className={`amount ${amountClass}`}>
          {sign}
          {formatRupiah(Math.abs(transaction.amount))}
        </span>
        <button
          onClick={() => editTransaction(transaction)}
          className="btn-action edit-btn"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          onClick={() => handleDelete(transaction._id)}
          className="btn-action delete-btn"
        >
          X
        </button>
      </div>
    </li>
  );
};

// --- KOMPONEN UTAMA ---
export const TransactionList = () => {
  const { transactions, getTransactions, loading } = useContext(GlobalContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h3>Riwayat Transaksi</h3>

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
