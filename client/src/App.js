import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalState";

// Import Halaman
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { Register } from "./components/Register"; // 1. Import ini (Nanti kita buat)

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />{" "}
          {/* 2. Rute Register */}
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
