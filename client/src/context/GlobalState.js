import React, { createContext, useReducer, useState, useEffect } from "react";
import AppReducer from "./AppReducer";
import axios from "axios";

// Initial State
const initialState = {
  transactions: [],
  budgets: [],
  error: null,
  loading: true,
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  user: null,
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // State Helper (Frontend Only)
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [dateFilter, setDateFilter] = useState(currentMonth);

  // [BARU] State untuk teks pencarian
  const [searchText, setSearchText] = useState("");

  // ==========================
  // 1. ACTIONS TRANSAKSI
  // ==========================
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

  // Helper Edit
  function editTransaction(transaction) {
    setCurrentTransaction(transaction);
  }
  function clearEdit() {
    setCurrentTransaction(null);
  }

  // ==========================
  // 2. ACTIONS BUDGET
  // ==========================
  async function getBudgets() {
    try {
      const res = await axios.get("/api/v1/budgets");
      dispatch({ type: "GET_BUDGETS", payload: res.data.data });
    } catch (err) {
      dispatch({ type: "BUDGET_ERROR", payload: err.response.data.error });
    }
  }

  async function setBudget(budgetData) {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/v1/budgets", budgetData, config);
      dispatch({ type: "SET_BUDGET", payload: res.data.data });
    } catch (err) {
      dispatch({ type: "BUDGET_ERROR", payload: err.response.data.error });
    }
  }

  async function deleteBudget(id) {
    try {
      await axios.delete(`/api/v1/budgets/${id}`);
      getBudgets();
    } catch (err) {
      dispatch({ type: "BUDGET_ERROR", payload: err.response.data.error });
    }
  }

  // ==========================
  // 3. ACTIONS AUTHENTICATION
  // ==========================

  // Load User
  async function loadUser() {
    if (localStorage.token) {
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

  // Register
  async function register(user) {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/v1/users/register", user, config);
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.token}`;
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
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

  // Login
  async function login(user) {
    const config = { headers: { "Content-Type": "application/json" } };
    try {
      const res = await axios.post("/api/v1/users/login", user, config);
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.token}`;
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
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

  // Logout
  function logout() {
    delete axios.defaults.headers.common["Authorization"];
    dispatch({ type: "LOGOUT" });
  }

  // ==========================
  // 4. LOGIKA FILTER (DATE & SEARCH)
  // ==========================
  const filteredTransactions = state.transactions.filter((transaction) => {
    // 1. Cek Tanggal
    let dateMatch = true;
    if (dateFilter !== "") {
      const transDate = transaction.transactionDate
        ? new Date(transaction.transactionDate).toISOString().slice(0, 7)
        : new Date(transaction.createdAt).toISOString().slice(0, 7);
      dateMatch = transDate === dateFilter;
    }

    // 2. [BARU] Cek Search Text (Keterangan ATAU Kategori)
    let textMatch = true;
    if (searchText !== "") {
      const textLower = searchText.toLowerCase();
      // Cek apakah ada kata kunci di 'text' atau 'category'
      const descMatch = transaction.text.toLowerCase().includes(textLower);
      const catMatch = transaction.category
        ? transaction.category.toLowerCase().includes(textLower)
        : false;
      textMatch = descMatch || catMatch;
    }

    // Lolos jika Tanggal COCOK -DAN- Teks COCOK
    return dateMatch && textMatch;
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

        budgets: state.budgets,

        currentTransaction,
        dateFilter,
        setDateFilter,

        // [BARU] Kirim fungsi search ke komponen lain
        searchText,
        setSearchText,

        getTransactions,
        deleteTransaction,
        addTransaction,
        updateTransaction,
        editTransaction,
        clearEdit,

        getBudgets,
        setBudget,
        deleteBudget,

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
