import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";

// Menerima props untuk kontrol Mobile
export const Sidebar = ({ isOpen, closeMenu }) => {
  const { user } = useContext(GlobalContext);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const menuItems = [
    { name: "Dashboard", icon: "fas fa-home", link: "/" },
    { name: "Transaksi", icon: "fas fa-exchange-alt", link: "/transactions" },
    { name: "Budgeting", icon: "fas fa-bullseye", link: "/budget" },
    { name: "Impian", icon: "fas fa-rocket", link: "/dreams" },
    { name: "Pasar", icon: "fas fa-chart-line", link: "/market" },
    // Menu Profil DIHAPUS dari sini
  ];

  return (
    <>
      {/* Overlay Gelap saat di Mobile */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={closeMenu}
      ></div>

      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        {/* LOGO & TUTUP (Mobile Only) */}
        <div
          style={{
            marginBottom: "40px",
            paddingLeft: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.4rem",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <i className="fas fa-wallet"></i> SmartFin
          </h2>
          {/* Tombol X muncul cuma di mobile (diatur CSS) */}
          <button className="close-sidebar-btn" onClick={closeMenu}>
            &times;
          </button>
        </div>

        {/* MENU */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flex: 1,
          }}
        >
          {menuItems.map((item, index) => {
            const isActive = path === item.link;
            return (
              <Link
                to={item.link}
                key={index}
                style={{ textDecoration: "none" }}
                onClick={closeMenu}
              >
                <div
                  style={{
                    padding: "12px 15px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    color: isActive ? "white" : "var(--text-secondary)",
                    background: isActive ? "var(--primary)" : "transparent",
                    fontWeight: isActive ? "600" : "400",
                    transition: "all 0.3s",
                    boxShadow: isActive
                      ? "0 5px 15px rgba(108, 92, 231, 0.3)"
                      : "none",
                  }}
                >
                  <i
                    className={item.icon}
                    style={{ width: "20px", textAlign: "center" }}
                  ></i>
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* USER MINI PROFILE (CLICKABLE) */}
        {user && (
          <div
            onClick={() => {
              navigate("/profile");
              closeMenu();
            }} // Bisa diklik & tutup menu
            style={{
              marginTop: "auto",
              padding: "15px",
              background: "var(--bg-main)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              border: "1px solid var(--border-color)",
              transition: "0.2s",
            }}
            className="sidebar-profile"
          >
            <img
              src={user.avatar || "https://via.placeholder.com/40"}
              alt="User"
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                }}
              >
                {user.name.split(" ")[0]}
              </div>
              <div
                style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}
              >
                Edit Profil{" "}
                <i
                  className="fas fa-chevron-right"
                  style={{ fontSize: "0.6rem", marginLeft: "3px" }}
                ></i>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
