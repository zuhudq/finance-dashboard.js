import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import Swal from "sweetalert2";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register, error, isAuthenticated } = useContext(GlobalContext);
  const navigate = useNavigate();

  // 1. Efek Redirect (Kalau sukses daftar, langsung masuk Dashboard)
  useEffect(() => {
    if (isAuthenticated) {
      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Selamat datang di Smart Finance",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/"); // Pindah ke Dashboard
    }

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Daftar",
        text: error,
      });
    }
  }, [error, isAuthenticated, navigate]);

  // 2. Handle Tombol Daftar
  const handleRegister = () => {
    if (!name || !email || !password) {
      Swal.fire({ icon: "warning", text: "Mohon lengkapi semua data!" });
      return;
    }

    // Kirim data ke GlobalState
    register({ name, email, password });
  };

  return (
    <div className="split-screen">
      {/* BAGIAN KIRI: GAMBAR */}
      <div className="left-pane">
        <div className="pane-content">
          <h1 className="brand-title">Smart Finance.</h1>
          <p className="brand-quote">
            "Mulai langkah finansial cerdasmu hari ini. Catat, pantau, dan
            kembangkan asetmu."
          </p>
        </div>
      </div>

      {/* BAGIAN KANAN: FORM REGISTER */}
      <div className="right-pane">
        <div className="auth-card-clean">
          <div className="auth-header">
            <h2 style={{ color: "#2d3436", fontSize: "2rem" }}>
              Buat Akun Baru 🚀
            </h2>
            <p style={{ marginTop: "10px", color: "#636e72" }}>
              Isi data di bawah ini
            </p>
          </div>

          <form>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                placeholder="Minimal 6 karakter..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="button" onClick={handleRegister} className="auth-btn">
              Daftar Sekarang
            </button>
          </form>

          <div
            className="auth-footer"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <p>
              Sudah punya akun?{" "}
              <Link to="/login" className="auth-link">
                Login Disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
