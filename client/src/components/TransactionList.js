import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import { formatRupiah } from "../utils/formatRupiah";
import Swal from "sweetalert2"; // 1. Import SweetAlert

const Transaction = ({ transaction }) => {
  const { deleteTransaction, editTransaction } = useContext(GlobalContext);
  const sign = transaction.amount < 0 ? "-" : "+";
  const amountClass = transaction.amount < 0 ? "minus" : "plus";

  // Format Tanggal: "Kamis, 22 Jan 2026"
  const dateObj = new Date(
    transaction.transactionDate || transaction.createdAt,
  );
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleDelete = (id) => {
    // ... kode sweetalert sama ...
    Swal.fire({
      title: "Yakin mau hapus?",
      text: "Data tidak bisa kembali!",
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

        {/* TAMPILAN BARU: Kategori & Tanggal Sejajar */}
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
        {/* ... bagian kanan sama ... */}
        <span className={`amount ${amountClass}`}>
          {sign}
          {formatRupiah(Math.abs(transaction.amount))}
        </span>
        <button
          onClick={() => editTransaction(transaction)}
          className="btn-action edit-btn"
        >
          <i className="fas fa-edit"></i> Edit
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

// ... (Bagian TransactionList ke bawah TIDAK PERLU DIUBAH, biarkan sama)
export const TransactionList = () => {
  // ... Biarkan kode TransactionList tetap sama ...
  const { transactions, getTransactions } = useContext(GlobalContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h3>Riwayat Transaksi</h3>
      <ul className="list">
        {transactions.map((transaction) => (
          <Transaction key={transaction._id} transaction={transaction} />
        ))}
      </ul>
    </>
  );
};
