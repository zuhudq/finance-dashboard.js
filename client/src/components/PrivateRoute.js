import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(GlobalContext);

  // 1. Tunggu Loading Selesai
  // (Penting: Biar gak langsung ditendang pas lagi cek token)
  if (loading) {
    return <div className="loading-screen">Memuat data...</div>;
  }

  // 2. Cek Tiket
  // Kalau loading kelar TAPI tidak terotentikasi, tendang ke Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Lolos Seleksi
  // Kalau aman, tampilkan halaman yang diminta (Dashboard)
  return children;
};
