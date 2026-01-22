import React from "react";
import { Link } from "react-router-dom";

export const Register = () => {
  return (
    <div className="auth-container">
      {" "}
      {/* Nanti kita styling class ini */}
      <div className="auth-card">
        <h2>📝 Daftar Akun</h2>
        <p>Halaman register coming soon...</p>
        <Link to="/login" className="auth-link">
          Sudah punya akun? Login
        </Link>
      </div>
    </div>
  );
};
