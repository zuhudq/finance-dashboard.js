import React, { createContext, useReducer, useState } from "react"; // Tambah useState
import AppReducer from "./AppReducer";
import axios from "axios";

// 1. Initial State
const initialState = {
  transactions: [],
  error: null,
  loading: true,
};

// 2. Create Context
export const GlobalContext = createContext(initialState);

// 3. Provider Component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // [BARU] State lokal untuk menyimpan data yang sedang diedit
  // Kita taruh di sini biar sederhana, tidak perlu masuk Reducer
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Actions

  // A. Ambil Data (GET)
  async function getTransactions() {
    try {
      const res = await axios.get("/api/v1/transactions");
      dispatch({
        type: "GET_TRANSACTIONS",
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: "TRANSACTION_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  // B. Hapus Data (DELETE)
  async function deleteTransaction(id) {
    try {
      await axios.delete(`/api/v1/transactions/${id}`);
      dispatch({
        type: "DELETE_TRANSACTION",
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: "TRANSACTION_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  // C. Tambah Data (POST)
  async function addTransaction(transaction) {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/v1/transactions", transaction, config);
      dispatch({
        type: "ADD_TRANSACTION",
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: "TRANSACTION_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  // [BARU] D. Update Data (PUT)
  async function updateTransaction(id, updatedTransaction) {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      // Panggil API PUT backend
      const res = await axios.put(
        `/api/v1/transactions/${id}`,
        updatedTransaction,
        config,
      );

      dispatch({
        type: "UPDATE_TRANSACTION",
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: "TRANSACTION_ERROR",
        payload: err.response.data.error,
      });
    }
  }

  // [BARU] Helper untuk Edit Mode
  // Fungsi ini dipanggil saat tombol Edit diklik
  function editTransaction(transaction) {
    setCurrentTransaction(transaction);
  }

  // Fungsi ini dipanggil untuk batal edit
  function clearEdit() {
    setCurrentTransaction(null);
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        currentTransaction, // Data yang sedang diedit
        getTransactions,
        deleteTransaction,
        addTransaction,
        updateTransaction, // Fungsi Update API
        editTransaction, // Fungsi aktifkan mode edit
        clearEdit, // Fungsi matikan mode edit
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
