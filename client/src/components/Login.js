import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import Swal from "sweetalert2";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, error, isAuthenticated } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: "Mengalihkan ke Dashboard...",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/");
    }

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error,
      });
    }
  }, [error, isAuthenticated, navigate]);

  // [DEBUG] Logika Login Manual
  const handleLogin = () => {
    console.log("🟢 TOMBOL LOGIN DITEKAN!"); // Cek Console browser nanti

    if (!email || !password) {
      Swal.fire({ icon: "warning", text: "Mohon isi email dan password!" });
      return;
    }

    // Panggil fungsi login
    login({ email, password });
  };

  return (
    <div className="split-screen">
      <div className="left-pane">
        <div className="pane-content">
          <h1 className="brand-title">Smart Finance.</h1>
          <p className="brand-quote">
            "Kelola keuangan bisnis dan pribadimu dengan cerdas, efisien, dan
            transparan."
          </p>
        </div>
      </div>

      <div className="right-pane">
        <div className="auth-card-clean">
          <div className="auth-header">
            <h2 style={{ color: "#2d3436", fontSize: "2rem" }}>
              Welcome Back! 👋
            </h2>
            <p style={{ marginTop: "10px", color: "#636e72" }}>
              Silakan login ke akun Anda
            </p>
          </div>

          <form>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* [FIX] Ganti type='button' dan pasang onClick */}
            <button type="button" onClick={handleLogin} className="auth-btn">
              Masuk Dashboard
            </button>
          </form>

          <div
            className="auth-footer"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <p>
              Belum punya akun?{" "}
              <Link to="/register" className="auth-link">
                Daftar Gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
