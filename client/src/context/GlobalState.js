import React, { createContext, useReducer, useState } from "react";
import AppReducer from "./AppReducer";
import axios from "axios";

// Initial State
const initialState = {
  transactions: [],
  error: null,
  loading: true,
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // [BARU] State untuk Edit
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // [BARU] State untuk Filter Bulan & Tahun
  // Format default: "2026-01" (YYYY-MM), atau "" untuk Semua Waktu
  const currentMonth = new Date().toISOString().slice(0, 7); // Ambil "YYYY-MM" hari ini
  const [dateFilter, setDateFilter] = useState(currentMonth);

  // Actions (GET, DELETE, ADD, UPDATE - Tetap Sama)
  async function getTransactions() {
    try {
      const res = await axios.get("/api/v1/transactions");
      dispatch({ type: "GET_TRANSACTIONS", payload: res.data.data });
    } catch (err) {
      dispatch({ type: "TRANSACTION_ERROR", payload: err.response.data.error });
    }
  }

  async function deleteTransaction(id) {
    try {
      await axios.delete(`/api/v1/transactions/${id}`);
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
    } catch (err) {
      dispatch({ type: "TRANSACTION_ERROR", payload: err.response.data.error });
    }
  }

  async function addTransaction(transaction) {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/v1/transactions", transaction, config);
      dispatch({ type: "ADD_TRANSACTION", payload: res.data.data });
    } catch (err) {
      dispatch({ type: "TRANSACTION_ERROR", payload: err.response.data.error });
    }
  }

  async function updateTransaction(id, updatedTransaction) {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.put(
        `/api/v1/transactions/${id}`,
        updatedTransaction,
        config,
      );
      dispatch({ type: "UPDATE_TRANSACTION", payload: res.data.data });
    } catch (err) {
      dispatch({ type: "TRANSACTION_ERROR", payload: err.response.data.error });
    }
  }

  function editTransaction(transaction) {
    setCurrentTransaction(transaction);
  }
  function clearEdit() {
    setCurrentTransaction(null);
  }

  // [BARU] LOGIKA FILTER SAKTI
  // Kita buat variabel baru 'filteredTransactions'
  // Ini yang akan dipakai oleh Chart & Saldo, BUKAN 'state.transactions' mentah
  const filteredTransactions = state.transactions.filter((transaction) => {
    if (dateFilter === "") return true; // Kalau filter kosong, tampilkan semua

    // Ambil YYYY-MM dari tanggal transaksi
    const transDate = transaction.transactionDate
      ? new Date(transaction.transactionDate).toISOString().slice(0, 7)
      : new Date(transaction.createdAt).toISOString().slice(0, 7);

    return transDate === dateFilter;
  });

  return (
    <GlobalContext.Provider
      value={{
        transactions: filteredTransactions, // [PENTING] Kita kirim data yang SUDAH DISARING
        allTransactions: state.transactions, // Data mentah (kalau butuh)
        error: state.error,
        loading: state.loading,
        currentTransaction,
        dateFilter, // Kirim state filter biar bisa diakses Header
        setDateFilter, // Kirim fungsi pengubah filter
        getTransactions,
        deleteTransaction,
        addTransaction,
        updateTransaction,
        editTransaction,
        clearEdit,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
