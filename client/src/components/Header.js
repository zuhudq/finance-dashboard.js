import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export const Header = () => {
  const { user, logout, isAuthenticated } = useContext(GlobalContext);
  const navigate = useNavigate();

  const onLogout = () => {
    Swal.fire({
      title: "Keluar?",
      text: "Sampai jumpa lagi!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d63031",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  // Ambil nama depan untuk sapaan "Hai..."
  const firstName = user ? user.name.split(" ")[0] : "";

  return (
    // [UBAH CSS] Hapus class 'navbar' lama, ganti dengan style inline baru yang lebih mantap
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(135deg, #6c5ce7, #a29bfe)", // Warna Gradient Keren
        padding: "15px 30px", // Lebih besar dan lega
        borderRadius: "15px",
        marginBottom: "30px",
        boxShadow: "0 10px 20px rgba(108, 92, 231, 0.2)",
        color: "white", // Teks putih biar kontras
      }}
    >
      {/* KIRI: Logo */}
      <Link to="/" style={{ textDecoration: "none", color: "white" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "800",
            display: "flex",
            alignItems: "center",
          }}
        >
          <i className="fas fa-wallet" style={{ marginRight: "10px" }}></i>
          Smart Finance
        </h2>
      </Link>

      {/* KANAN: User Info & Logout */}
      {isAuthenticated && user ? (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Bagian Profil (Bisa diklik ke halaman profil) */}
          <div
            onClick={() => navigate("/profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
            title="Klik untuk edit profil"
          >
            <div style={{ textAlign: "right" }}>
              {/* Sapaan Hai... */}
              <span
                style={{ display: "block", fontSize: "0.85rem", opacity: 0.8 }}
              >
                Hai, {firstName} 👋
              </span>
              {/* Nama Lengkap */}
              <span style={{ fontWeight: "700", fontSize: "1.1rem" }}>
                {user.name}
              </span>
            </div>

            {/* Foto Profil / Avatar */}
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid rgba(255,255,255,0.5)",
                }}
              />
            ) : (
              // Placeholder kalau belum ada foto
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1.5rem",
                }}
              >
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>

          {/* Tombol Logout (Lebih simpel) */}
          <button
            onClick={onLogout}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "none",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "0.3s",
            }}
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      ) : null}
    </div>
  );
};
