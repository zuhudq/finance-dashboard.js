import React from "react";

export const Header = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* LOGO & NAMA APP (Dibuat Center & Besar) */}
        <div style={styles.brand}>
          <span style={styles.icon}>💸</span>
          <h2 style={styles.title}>SMART FINANCE</h2>
        </div>

        {/* Tombol Login DIHAPUS sesuai request */}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#6c5ce7",
    backgroundImage: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)", // Gradasi lebih halus miring
    padding: "20px 0", // Padding diperbesar biar lebih gagah
    marginBottom: "30px",
    boxShadow: "0 4px 20px rgba(108, 92, 231, 0.4)", // Bayangan lebih luas (Glow effect)
    borderRadius: "0 0 25px 25px", // Lengkungan lebih tajam
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "center", // [PENTING] Judul sekarang di TENGAH
    alignItems: "center",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "15px", // Jarak ikon dan teks diperlebar
    color: "#fff",
    // Efek agar teks tidak bisa di-select (seperti aplikasi native)
    userSelect: "none",
    cursor: "default",
  },
  icon: {
    fontSize: "2.5rem", // Ikon diperbesar
    filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.2))", // Ikon dikasih bayangan
  },
  title: {
    margin: 0,
    fontSize: "1.8rem", // Font diperbesar
    fontWeight: "800", // Extra Bold
    letterSpacing: "2px", // Spasi antar huruf biar elegan
    textTransform: "uppercase", // Huruf Kapital Semua biar Tegas
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)", // Bayangan teks (efek 3D timbul)
    fontFamily: "'Poppins', sans-serif",
  },
};
