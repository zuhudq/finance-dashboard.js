import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export const FinancialGoals = () => {
  // --- 1. STATE MANAGEMENT (LOCAL STORAGE) ---
  const [goals, setGoals] = useState(() => {
    const localData = localStorage.getItem("smart_goals");
    return localData
      ? JSON.parse(localData)
      : [
          // Data Dummy Awal biar gak kosong melompong
          {
            id: 1,
            title: "Rumah Idaman",
            target: 500000000,
            current: 75000000,
            deadline: "2030-12-31",
            icon: "🏠",
            color: "#6c5ce7",
          },
          {
            id: 2,
            title: "Nikah Mewah",
            target: 100000000,
            current: 85000000,
            deadline: "2026-08-17",
            icon: "💍",
            color: "#ff7675",
          },
          {
            id: 3,
            title: "MacBook Pro M4",
            target: 30000000,
            current: 5000000,
            deadline: "2026-05-01",
            icon: "💻",
            color: "#00b894",
          },
        ];
  });

  const [showForm, setShowForm] = useState(false);

  // Input State
  const [title, setTitle] = useState("");
  const [targetRaw, setTargetRaw] = useState("");
  const [currentRaw, setCurrentRaw] = useState("");
  const [deadline, setDeadline] = useState("");

  // Simpan ke LocalStorage tiap ada perubahan
  useEffect(() => {
    localStorage.setItem("smart_goals", JSON.stringify(goals));
  }, [goals]);

  // --- 2. LOGIKA MATEMATIKA KOMPLEKS ---
  const calculateProgress = (current, target) => {
    let percent = (current / target) * 100;
    return Math.min(percent, 100).toFixed(1);
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getTimeRemaining = (deadlineDate) => {
    const total = Date.parse(deadlineDate) - Date.parse(new Date());
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);

    if (days < 0) return { text: "Terlewat!", isUrgent: true };
    if (months > 12)
      return {
        text: `${(months / 12).toFixed(1)} Tahun lagi`,
        isUrgent: false,
      };
    if (months > 0)
      return { text: `${months} Bulan lagi`, isUrgent: months < 3 };
    return { text: `${days} Hari lagi`, isUrgent: true };
  };

  const getRecommendation = (target, current, deadlineDate) => {
    const total = Date.parse(deadlineDate) - Date.parse(new Date());
    const months = Math.floor(total / (1000 * 60 * 60 * 24 * 30));
    const gap = target - current;

    if (gap <= 0) return "Target Tercapai! 🎉";
    if (months <= 0) return "Deadline sudah lewat!";

    const savingPerMonth = gap / months;
    return `Nabung ${formatRupiah(savingPerMonth)} / bulan`;
  };

  // --- 3. CRUD ACTION ---
  const handleAddGoal = (e) => {
    e.preventDefault();
    const target = parseInt(targetRaw.replace(/\./g, "")) || 0;
    const current = parseInt(currentRaw.replace(/\./g, "")) || 0;

    const newGoal = {
      id: Date.now(),
      title,
      target,
      current,
      deadline,
      icon: "🎯", // Default icon
      color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color
    };

    setGoals([...goals, newGoal]);
    setShowForm(false);
    resetForm();
    Swal.fire("Mantap!", "Target impian berhasil ditambahkan!", "success");
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin hapus mimpi ini?",
      text: "Jangan menyerah sebelum tercapai!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        setGoals(goals.filter((g) => g.id !== id));
        Swal.fire("Dihapus!", "Data target dihapus.", "success");
      }
    });
  };

  const resetForm = () => {
    setTitle("");
    setTargetRaw("");
    setCurrentRaw("");
    setDeadline("");
  };

  const handleCurrencyInput = (val, setter) => {
    const raw = val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setter(raw);
  };

  return (
    <div
      className="budget-container"
      style={{ marginTop: "30px", animation: "fadeInUp 0.8s ease-out" }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.8rem" }}>🚀</span>
          <div>
            <h3
              style={{
                margin: 0,
                border: "none",
                fontSize: "1.3rem",
                color: "var(--text-primary)",
              }}
            >
              Dream Planner
            </h3>
            <small style={{ color: "var(--text-secondary)" }}>
              Rencanakan masa depanmu sekarang
            </small>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn"
          style={{
            width: "auto",
            padding: "10px 20px",
            margin: 0,
            background: showForm ? "#ff7675" : "var(--primary)",
          }}
        >
          {showForm ? "Batal" : "+ Target Baru"}
        </button>
      </div>

      {/* FORM TAMBAH TARGET */}
      {showForm && (
        <form
          onSubmit={handleAddGoal}
          style={{
            background: "var(--bg-main)",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "30px",
            border: "1px solid var(--border-color)",
            boxShadow: "none",
          }}
        >
          <h4 style={{ marginBottom: "15px", color: "var(--text-primary)" }}>
            🎯 Definisikan Mimpimu
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            <div className="form-control" style={{ marginBottom: 0 }}>
              <label>Nama Target</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Beli Rumah"
                required
              />
            </div>
            <div className="form-control" style={{ marginBottom: 0 }}>
              <label>Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
            <div className="form-control" style={{ marginBottom: 0 }}>
              <label>Butuh Uang Berapa?</label>
              <input
                type="text"
                value={targetRaw}
                onChange={(e) =>
                  handleCurrencyInput(e.target.value, setTargetRaw)
                }
                placeholder="Rp"
                required
              />
            </div>
            <div className="form-control" style={{ marginBottom: 0 }}>
              <label>Sudah Terkumpul?</label>
              <input
                type="text"
                value={currentRaw}
                onChange={(e) =>
                  handleCurrencyInput(e.target.value, setCurrentRaw)
                }
                placeholder="Rp"
              />
            </div>
          </div>
          <button className="btn" style={{ marginTop: "20px" }}>
            🚀 Luncurkan Mimpi!
          </button>
        </form>
      )}

      {/* DAFTAR KARTU IMPIAN (GRID 3D) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {goals.map((goal) => {
          const percent = calculateProgress(goal.current, goal.target);
          const timeInfo = getTimeRemaining(goal.deadline);
          const advice = getRecommendation(
            goal.target,
            goal.current,
            goal.deadline,
          );

          return (
            <div
              key={goal.id}
              style={{
                background: "var(--bg-card)",
                borderRadius: "20px",
                padding: "25px",
                border: "1px solid var(--border-color)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {/* Hapus Button */}
              <button
                onClick={() => handleDelete(goal.id)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  opacity: 0.5,
                }}
              >
                ×
              </button>

              {/* Judul & Ikon */}
              <div
                style={{ display: "flex", gap: "15px", marginBottom: "20px" }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "15px",
                    background: `${goal.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  {goal.icon}
                </div>
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "1.1rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    {goal.title}
                  </h4>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: timeInfo.isUrgent
                        ? "var(--danger)"
                        : "var(--text-secondary)",
                      fontWeight: "600",
                    }}
                  >
                    ⏳ {timeInfo.text}
                  </span>
                </div>
              </div>

              {/* Progress Bar 3D */}
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    {percent}%
                  </span>
                  <span style={{ color: "var(--primary)" }}>
                    {formatRupiah(goal.current)}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "12px",
                    background: "var(--bg-main)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${goal.color}, ${goal.color}aa)`,
                      borderRadius: "10px",
                      transition: "width 1s ease",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    marginTop: "5px",
                  }}
                >
                  Target: {formatRupiah(goal.target)}
                </div>
              </div>

              {/* AI Advice Box */}
              <div
                style={{
                  background: "rgba(108, 92, 231, 0.05)",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderLeft: `3px solid ${goal.color}`,
                }}
              >
                <i className="fas fa-robot"></i>
                <span>{advice}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
