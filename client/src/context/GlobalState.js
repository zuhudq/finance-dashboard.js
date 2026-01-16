import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

// 1. Initial State (Data Awal)
const initialState = {
  transactions: [
    { id: 1, text: "Beli Bunga", amount: -50000 },
    { id: 2, text: "Gaji Freelance", amount: 300000 },
    { id: 3, text: "Beli Buku", amount: -150000 },
  ],
};

// 2. Buat Context (Wadah)
export const GlobalContext = createContext(initialState);

// 3. Provider Component (Penyedia Data ke Komponen Lain)
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions (Fungsi untuk mengubah data)
  function deleteTransaction(id) {
    dispatch({
      type: "DELETE_TRANSACTION",
      payload: id,
    });
  }

  function addTransaction(transaction) {
    dispatch({
      type: "ADD_TRANSACTION",
      payload: transaction,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        deleteTransaction,
        addTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
