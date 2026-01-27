import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom"; // [WAJIB] Import ini untuk portal
import { GlobalContext } from "../context/GlobalState";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { user, loadUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  // State Data Diri
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  // State Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // State Modal
  const [showModal, setShowModal] = useState(false);

  // Load data awal
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPreview(user.avatar || "");
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const configMultipart = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    const configJson = { headers: { "Content-Type": "application/json" } };

    let isProfileUpdated = false;
    let isPasswordUpdated = false;

    // 1. UPDATE DATA DIRI
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (file) {
        formData.append("avatar", file);
      }

      await axios.put("/api/v1/users/updatedetails", formData, configMultipart);
      isProfileUpdated = true;
      await loadUser();
    } catch (err) {
      Swal.fire(
        "Gagal Update Profil",
        err.response?.data?.error || "Error server",
        "error",
      );
      return;
    }

    // 2. CEK PASSWORD
    if (newPassword) {
      if (!currentPassword) {
        Swal.fire(
          "Gagal",
          "Mohon isi Password Lama untuk konfirmasi penggantian password.",
          "warning",
        );
        return;
      }

      try {
        await axios.put(
          "/api/v1/users/updatepassword",
          { currentPassword, newPassword },
          configJson,
        );
        isPasswordUpdated = true;
      } catch (err) {
        Swal.fire(
          "Gagal Ganti Password",
          err.response?.data?.error || "Password lama salah",
          "error",
        );
        return;
      }
    }

    // 3. FINAL RESULT
    if (isProfileUpdated || isPasswordUpdated) {
      Swal.fire({
        icon: "success",
        title: "Perubahan Berhasil Disimpan!",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/");
      });
    }
  };

  return (
    <>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <h2 style={{ marginBottom: "20px", color: "var(--text-primary)" }}>
          Pengaturan Akun ⚙️
        </h2>

        <form
          onSubmit={onSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "30px",
          }}
          autoComplete="off"
        >
          {/* --- KOLOM KIRI --- */}
          <div
            className="auth-card-clean"
            style={{ margin: 0, padding: "30px", height: "fit-content" }}
          >
            <h3
              style={{
                marginBottom: "20px",
                borderBottom: "2px solid var(--border-color)",
                paddingBottom: "10px",
              }}
            >
              Profil Saya
            </h3>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                {preview ? (
                  <img
                    src={preview}
                    alt="Avatar"
                    onClick={() => setShowModal(true)}
                    title="Klik untuk memperbesar"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "4px solid #6c5ce7",
                      boxShadow: "0 5px 15px rgba(108, 92, 231, 0.3)",
                      cursor: "zoom-in",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                ) : (
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      background: "#dfe6e9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                      color: "#b2bec3",
                      margin: "0 auto",
                    }}
                  >
                    <i className="fas fa-user"></i>
                  </div>
                )}

                <label
                  htmlFor="file-upload"
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "5px",
                    background: "#0984e3",
                    color: "white",
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    zIndex: 2,
                  }}
                  title="Ganti Foto"
                >
                  <i
                    className="fas fa-camera"
                    style={{ fontSize: "0.9rem" }}
                  ></i>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginTop: "10px",
                }}
              >
                Klik gambar untuk memperbesar
              </p>
            </div>

            <div className="form-control">
              <label>Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* --- KOLOM KANAN --- */}
          <div
            className="auth-card-clean"
            style={{ margin: 0, padding: "30px", height: "fit-content" }}
          >
            <h3
              style={{
                marginBottom: "20px",
                borderBottom: "2px solid var(--border-color)",
                paddingBottom: "10px",
              }}
            >
              Keamanan
            </h3>

            <div
              style={{
                background: "rgba(255, 238, 186, 0.3)",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #ffeeba",
              }}
            >
              <small style={{ color: "#856404" }}>
                <i className="fas fa-info-circle"></i> <b>Catatan:</b> Kosongkan
                jika tidak ingin ganti password.
              </small>
            </div>

            <div className="form-control">
              <label>Password Lama</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="******"
                autoComplete="new-password"
              />
            </div>
            <div className="form-control">
              <label>Password Baru</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
              />
            </div>

            <hr
              style={{
                margin: "30px 0",
                border: "0",
                borderTop: "1px solid var(--border-color)",
              }}
            />

            <button className="btn">Simpan Perubahan</button>
          </div>
        </form>
      </div>

      {/* --- MODAL POPUP GAMBAR BESAR (PORTAL FIX) --- */}
      {showModal &&
        preview &&
        ReactDOM.createPortal(
          <div
            className="avatar-modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div
              className="avatar-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="avatar-modal-close"
                onClick={() => setShowModal(false)}
              >
                &times;
              </span>
              <img src={preview} alt="Full Size Avatar" />
            </div>
          </div>,
          document.body, // Koma di dalam kurung portal!
        )}
    </>
  );
};
