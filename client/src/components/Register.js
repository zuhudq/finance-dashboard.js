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

  // [DEBUG] Cek apakah fungsi register terbaca dari GlobalState
  // Buka Console browser, harusnya muncul function(...)
  console.log("Fungsi Register dari Context:", register);

  useEffect(() => {
    // Jika sukses register (isAuthenticated jadi true)
    if (isAuthenticated) {
      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Selamat datang di Smart Finance.",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/");
    }

    // Jika ada error dari backend
    if (error === "Email sudah terdaftar") {
      Swal.fire({
        icon: "error",
        title: "Gagal Daftar",
        text: "Email tersebut sudah digunakan!",
      });
    }
  }, [error, isAuthenticated, navigate]);

  // [MODIFIKASI] Ganti nama jadi handleRegister biar jelas
  const handleRegister = () => {
    // [DEBUG] Log ini WAJIB muncul di Console saat tombol diklik
    console.log("🟢 TOMBOL DITEKAN! Data:", { name, email, password });

    if (!name || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Mohon isi semua kolom!",
      });
      return;
    }

    const newUser = {
      name,
      email,
      password,
    };

    // Panggil fungsi ke Backend
    register(newUser);
  };

  return (
    <div className="split-screen">
      <div className="left-pane">
        <div className="pane-content">
          <h1 className="brand-title">Join Us.</h1>
          <p className="brand-quote">
            "Mulai langkah pertamamu menuju kebebasan finansial. Catat, pantau,
            dan kendalikan uangmu hari ini."
          </p>
        </div>
      </div>

      <div className="right-pane">
        <div className="auth-card-clean">
          <div className="auth-header">
            <h2
              style={{
                color: "#2d3436",
                fontWeight: "800",
                fontSize: "2rem",
                marginBottom: "5px",
              }}
            >
              Buat Akun Baru 🚀
            </h2>
            <p style={{ marginTop: "5px", color: "#636e72" }}>
              Gratis dan hanya butuh 1 menit.
            </p>
          </div>

          {/* [MODIFIKASI] Hapus onSubmit={onSubmit} dari sini. Biarkan form polos. */}
          <form>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Minimal 6 karakter..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* [MODIFIKASI UTAMA] 
                1. type="button" (Bukan submit, biar gak refresh halaman)
                2. onClick={handleRegister} (Langsung panggil fungsi)
            */}
            <button type="button" onClick={handleRegister} className="auth-btn">
              Daftar Sekarang
            </button>
          </form>

          <div
            className="auth-footer"
            style={{ marginTop: "20px", textAlign: "center" }}
          >
            <p style={{ color: "#636e72" }}>
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
