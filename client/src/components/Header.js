import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { useNavigate } from "react-router-dom"; // Buat pindah halaman
import Swal from "sweetalert2";

export const Header = () => {
  // Ambil user dan fungsi logout dari GlobalState
  const { user, logout, isAuthenticated } = useContext(GlobalContext);
  const navigate = useNavigate();

  const onLogout = () => {
    Swal.fire({
      title: "Yakin mau keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6c5ce7",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Panggil fungsi logout
        navigate("/login"); // Tendang ke halaman login
        Swal.fire("Logout Berhasil", "Sampai jumpa lagi!", "success");
      }
    });
  };

  return (
    <div className="navbar">
      <h2 className="navbar-logo">
        <i className="fas fa-wallet" style={{ marginRight: "10px" }}></i>
        Smart Finance
      </h2>

      {/* Tampilkan Nama User & Tombol Logout HANYA jika sudah login */}
      {isAuthenticated && user ? (
        <div className="navbar-user">
          <span style={{ marginRight: "15px", fontWeight: "600" }}>
            Halo, {user.name.split(" ")[0]} 👋
          </span>
          <button onClick={onLogout} className="btn-logout">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      ) : null}
    </div>
  );
};
