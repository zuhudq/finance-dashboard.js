import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GlobalProvider } from "./context/GlobalState";

// Import Components
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { PrivateRoute } from "./components/PrivateRoute"; // <--- Import Satpam

import "./App.css";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* 1. Halaman Publik (Bebas Akses) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 2. Halaman Privat (Dijaga Satpam) */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* 3. Catch-All: Kalau nyasar ke link aneh, balikin ke Login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;
