import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", email, password);
  };

  return (
    <div className="split-screen">
      {/* BAGIAN KIRI: GAMBAR & BRANDING */}
      <div className="left-pane">
        <div className="pane-content">
          <h1 className="brand-title">Smart Finance.</h1>
          <p className="brand-quote">
            "Kelola keuangan bisnis dan pribadimu dengan cerdas, efisien, dan
            transparan dalam satu dashboard."
          </p>
        </div>
      </div>

      {/* BAGIAN KANAN: FORM LOGIN */}
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

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-btn">
              Masuk Dashboard
            </button>
          </form>

          <div className="auth-footer">
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
