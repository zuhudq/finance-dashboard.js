import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GlobalProvider } from "./context/GlobalState";

import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
// [1] IMPORT PROFILE
import { Profile } from "./components/Profile";
import { PrivateRoute } from "./components/PrivateRoute";

import "./App.css";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* HALAMAN PRIVAT */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* [2] TAMBAH ROUTE PROFILE (Juga diproteksi) */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;
