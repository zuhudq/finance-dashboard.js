import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export const Header = () => {
  const { user, logout, isAuthenticated, theme, toggleTheme } =
    useContext(GlobalContext);
  const navigate = useNavigate();

  // Update atribut body saat tema berubah
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const onLogout = () => {
    Swal.fire({
      title: "Keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6c5ce7",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  // Ambil nama depan untuk sapaan
  const firstName = user ? user.name.split(" ")[0] : "User";

  return (
    // Style background dipindah ke CSS (.navbar) agar lebih rapi
    <div className="navbar">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h2 className="navbar-logo">
          <i className="fas fa-wallet" style={{ marginRight: "10px" }}></i>
          Smart Finance
        </h2>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Tombol Dark Mode */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title="Ganti Tema"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {isAuthenticated && user ? (
          <>
            <div
              onClick={() => navigate("/profile")}
              className="navbar-profile-box"
            >
              {/* [FIX] Tampilkan Sapaan DAN Nama Lengkap */}
              <div style={{ textAlign: "right", lineHeight: "1.2" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    opacity: 0.9,
                    fontWeight: "400",
                  }}
                >
                  Hai, {firstName} 👋
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.95rem",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                  }}
                >
                  {user.name}
                </span>
              </div>

              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgba(255,255,255,0.5)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>

            <button onClick={onLogout} className="btn-logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};
