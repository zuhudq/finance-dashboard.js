import React, { createContext, useReducer, useState, useEffect } from "react";
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

  // State Helper
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

  // 1. Load User (Saat Refresh)
  async function loadUser() {
    if (localStorage.token) {
      // Set Header saat aplikasi mulai
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${localStorage.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      dispatch({ type: "AUTH_ERROR" });
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

  useEffect(() => {
    loadUser();
  }, []);

  // 2. Register
  async function register(user) {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/v1/users/register", user, config);

      // [FIX PENTING] Langsung set token ke Header Axios DETIK INI JUGA!
      // Agar request berikutnya (getTransactions) pakai token baru
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.token}`;

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "REGISTER_FAIL",
        payload:
          err.response && err.response.data.error
            ? err.response.data.error
            : "Register Gagal",
      });
    }
  }

  // 3. Login
  async function login(user) {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/v1/users/login", user, config);

      // [FIX PENTING] Langsung set token ke Header Axios DETIK INI JUGA!
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.token}`;

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "LOGIN_FAIL",
        payload:
          err.response && err.response.data.error
            ? err.response.data.error
            : "Login Gagal",
      });
    }
  }

  // 4. Logout
  function logout() {
    // [FIX PENTING] Hapus token dari kepala Axios juga!
    delete axios.defaults.headers.common["Authorization"];

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
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        currentTransaction,
        dateFilter,
        setDateFilter,
        getTransactions,
        deleteTransaction,
        addTransaction,
        updateTransaction,
        editTransaction,
        clearEdit,
        register,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
