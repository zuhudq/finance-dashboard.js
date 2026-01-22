import React, { createContext, useReducer, useState } from "react";
import AppReducer from "./AppReducer";
import axios from "axios";

// Initial State (Ditambah Auth)
const initialState = {
  transactions: [],
  error: null,
  loading: true,
  // State Auth Baru
  token: localStorage.getItem("token"), // Cek apakah ada token tersimpan?
  isAuthenticated: null,
  user: null,
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // State Lokal (Helper UI)
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [dateFilter, setDateFilter] = useState(currentMonth);

  // --- ACTIONS TRANSAKSI (Tetap Sama) ---
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

  // --- ACTION AUTH (BARU) ---

  // Register User (Versi Detektif & Anti-Crash)
  async function register(user) {
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    try {
      console.log("1. Mengirim data ke backend...", user); // [DEBUG] Cek apakah fungsi jalan

      const res = await axios.post("/api/v1/users/register", user, config);

      console.log("2. Backend merespon sukses:", res.data); // [DEBUG] Cek respon

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      console.error("3. Terjadi Error:", err); // [DEBUG] Lihat error asli di console

      // [SOLUSI CRASH] Cek dulu apakah server memberikan respon atau mati total
      const errorMessage =
        err.response && err.response.data && err.response.data.error
          ? err.response.data.error // Error dari Backend (misal: Email kembar)
          : "Koneksi ke Server Gagal (Cek Terminal Backend)"; // Error Jaringan

      dispatch({
        type: "REGISTER_FAIL",
        payload: errorMessage,
      });
    }
  }

  // Logika Filter
  const filteredTransactions = state.transactions.filter((transaction) => {
    if (dateFilter === "") return true;
    const transDate = transaction.transactionDate
      ? new Date(transaction.transactionDate).toISOString().slice(0, 7)
      : new Date(transaction.createdAt).toISOString().slice(0, 7);
    return transDate === dateFilter;
  });

  return (
    <GlobalContext.Provider
      value={{
        transactions: filteredTransactions,
        allTransactions: state.transactions,
        error: state.error,
        loading: state.loading,

        // Auth State
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,

        // Helper State
        currentTransaction,
        dateFilter,
        setDateFilter,

        // Functions
        getTransactions,
        deleteTransaction,
        addTransaction,
        updateTransaction,
        editTransaction,
        clearEdit,
        register, // <-- Export fungsi register
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
