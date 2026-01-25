import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

export const TransactionSearch = () => {
  const { searchText, setSearchText } = useContext(GlobalContext);

  return (
    <div
      style={{
        marginBottom: "20px",
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Ikon Kaca Pembesar */}
      <i
        className="fas fa-search"
        style={{
          position: "absolute",
          left: "15px",
          color: "#b2bec3",
          fontSize: "1rem",
        }}
      ></i>

      {/* Input Search */}
      <input
        type="text"
        placeholder="Cari transaksi (misal: Nasi, Gaji, Transport)..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 12px 12px 45px", // Padding kiri besar buat ikon
          borderRadius: "10px",
          border: "1px solid #dfe6e9",
          fontSize: "1rem",
          backgroundColor: "#f1f2f6",
          outline: "none",
          transition: "all 0.3s",
        }}
        onFocus={(e) => (e.target.style.backgroundColor = "#fff")} // Efek putih saat diklik
        onBlur={(e) => (e.target.style.backgroundColor = "#f1f2f6")}
      />

      {/* Tombol Clear (X) Muncul kalau ada ketikan */}
      {searchText && (
        <button
          onClick={() => setSearchText("")}
          style={{
            position: "absolute",
            right: "15px",
            background: "none",
            border: "none",
            color: "#b2bec3",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};
