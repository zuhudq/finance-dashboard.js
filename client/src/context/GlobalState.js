import React, { createContext, useReducer, useState } from "react";
import AppReducer from "./AppReducer";
import axios from "axios";

// Initial State
const initialState = {
  transactions: [],
  error: null,
  loading: true,
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  user: null,
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // State Lokal Helper
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [dateFilter, setDateFilter] = useState(currentMonth);

  // --- ACTIONS TRANSAKSI ---
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

  // --- ACTIONS AUTH ---

  // 1. Load User (Auto Login)
  async function loadUser() {
    if (localStorage.token) {
      // Set token ke header axios biar otomatis kebawa
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${localStorage.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      // Jika token tidak ada, jangan panggil API, langsung return
      return;
    }

    try {
      const res = await axios.get("/api/v1/users/me");
      dispatch({
        type: "USER_LOADED",
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({ type: "AUTH_ERROR" });
    }
  }

  // 2. Register
  async function register(user) {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/v1/users/register", user, config);
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
      // Setelah register sukses, langsung load user
      loadUser();
    } catch (err) {
      dispatch({ type: "REGISTER_FAIL", payload: err.response.data.error });
    }
  }

  // 3. Login
  async function login(user) {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/v1/users/login", user, config);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      // Setelah login sukses, langsung load user
      loadUser();
    } catch (err) {
      const message =
        err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : "Login Gagal. Cek server.";
      dispatch({ type: "LOGIN_FAIL", payload: message });
    }
  }

  // 4. Logout
  function logout() {
    dispatch({ type: "LOGOUT" });
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

        // Functions Transaksi
        getTransactions,
        deleteTransaction,
        addTransaction,
        updateTransaction,
        editTransaction,
        clearEdit,

        // Functions Auth
        register,
        login,
        logout,
        loadUser, // <--- INI DIA YANG TADINYA HILANG! SEKARANG SUDAH ADA.
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
