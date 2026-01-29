import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ReactDOM from "react-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Registrasi ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export const FinancialGoals = () => {
  // --- STATE ---
  const [goals, setGoals] = useState(() => {
    const localData = localStorage.getItem("smart_goals_v3");
    return localData
      ? JSON.parse(localData)
      : [
          {
            id: 1,
            title: "Nikah Mewah",
            target: 50000000,
            current: 5000000,
            savingAmount: 1000000,
            frequency: "Mingguan",
            icon: "💍",
            color: "#ff7675",
            logs: [{ date: new Date().toISOString(), amount: 5000000 }],
            createdAt: new Date().toISOString(),
          },
        ];
  });

  const [showForm, setShowForm] = useState(false);

  // State untuk Modal Detail
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Input State
  const [title, setTitle] = useState("");
  const [targetRaw, setTargetRaw] = useState("");
  const [savingRaw, setSavingRaw] = useState("");
  const [frequency, setFrequency] = useState("Bulanan");

  useEffect(() => {
    localStorage.setItem("smart_goals_v3", JSON.stringify(goals));
  }, [goals]);

  // --- HELPER ---
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  const handleCurrencyInput = (val, setter) => {
    const raw = val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setter(raw);
  };

  // --- ACTIONS ---
  const handleAddGoal = (e) => {
    e.preventDefault();
    const target = parseInt(targetRaw.replace(/\./g, "")) || 0;
    const savingAmount = parseInt(savingRaw.replace(/\./g, "")) || 0;

    if (target <= 0 || savingAmount <= 0) return;

    const newGoal = {
      id: Date.now(),
      title,
      target,
      current: 0,
      savingAmount,
      frequency,
      icon: "🎯",
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      logs: [],
      createdAt: new Date().toISOString(),
    };

    setGoals([...goals, newGoal]);
    setShowForm(false);
    setTitle("");
    setTargetRaw("");
    setSavingRaw("");
    Swal.fire("Target Terkunci!", "Ayo disiplin nabungnya!", "success");
  };

  const handleDeposit = (id, e) => {
    e.stopPropagation(); // Biar gak kebuka modal detailnya
    const goal = goals.find((g) => g.id === id);

    Swal.fire({
      title: `Setor ${formatRupiah(goal.savingAmount)}?`,
      text: `Absen ${goal.frequency} untuk "${goal.title}"`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00b894",
      confirmButtonText: "Ya, Setor!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedGoals = goals.map((g) => {
          if (g.id === id) {
            const newCurrent = g.current + g.savingAmount;
            const newLog = {
              date: new Date().toISOString(),
              amount: g.savingAmount,
            };
            return { ...g, current: newCurrent, logs: [...g.logs, newLog] };
          }
          return g;
        });
        setGoals(updatedGoals);

        // Update juga selectedGoal kalau lagi dibuka modalnya
        if (selectedGoal && selectedGoal.id === id) {
          const updatedGoal = updatedGoals.find((g) => g.id === id);
          setSelectedGoal(updatedGoal);
        }
        Swal.fire("Mantap!", "Saldo bertambah.", "success");
      }
    });
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    Swal.fire({
      title: "Hapus?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    }).then((res) => {
      if (res.isConfirmed) {
        setGoals(goals.filter((g) => g.id !== id));
        setSelectedGoal(null); // Tutup modal jika yang dihapus lagi dibuka
      }
    });
  };

  // --- LOGIKA GENERATE KOTAK ABSEN (TRACKER GRID) ---
  const renderTrackerGrid = (goal) => {
    const totalNeeded = Math.ceil(goal.target / goal.savingAmount); // Total kotak yang dibutuhkan
    const filledCount = Math.floor(goal.current / goal.savingAmount); // Kotak yang sudah terisi

    // Batasi max kotak biar gak nge-lag kalau targetnya gila-gilaan (misal max 100 kotak visual)
    // Kalau lebih dari 100, kita scaling (1 kotak = x setoran) - Tapi untuk simpel, kita limit render dulu
    const maxBoxes = 104; // Contoh: 2 tahun mingguan (52 minggu x 2)
    const boxes = [];

    for (let i = 0; i < Math.min(totalNeeded, maxBoxes); i++) {
      const isFilled = i < filledCount;
      boxes.push(
        <div
          key={i}
          title={`Setoran ke-${i + 1}`}
          style={{
            width: "25px",
            height: "25px",
            background: isFilled ? goal.color : "rgba(255,255,255,0.1)",
            border: isFilled ? "none" : `1px solid ${goal.color}40`,
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.7rem",
            color: "white",
            transition: "0.3s",
          }}
        >
          {isFilled && <i className="fas fa-check"></i>}
        </div>,
      );
    }

    return (
      <div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            maxHeight: "200px",
            overflowY: "auto",
            paddingRight: "5px",
          }}
        >
          {boxes}
          {totalNeeded > maxBoxes && (
            <span
              style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
            >
              ...dan {totalNeeded - maxBoxes} setoran lagi.
            </span>
          )}
        </div>
        <p
          style={{
            marginTop: "10px",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
          }}
        >
          Progress: <b>{filledCount}</b> / {totalNeeded} {goal.frequency} (
          {Math.round((filledCount / totalNeeded) * 100)}%)
        </p>
      </div>
    );
  };

  // --- LOGIKA CHART GRAFIK (LINE CHART) ---
  const renderChart = (goal) => {
    const dataPoints = goal.logs.map((log, index) => ({
      x: index + 1, // Setoran ke-1, ke-2, dst
      y: goal.savingAmount * (index + 1), // Akumulasi
    }));

    // Tambahkan titik 0 di awal
    const labels = ["Start", ...dataPoints.map((d) => `Ke-${d.x}`)];
    const dataValues = [0, ...dataPoints.map((d) => d.y)];

    const data = {
      labels,
      datasets: [
        {
          label: "Pertumbuhan Tabungan",
          data: dataValues,
          borderColor: goal.color,
          backgroundColor: `${goal.color}20`,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false }, // Sembunyikan label X biar rapi
        y: { display: false }, // Sembunyikan label Y biar rapi
      },
    };

    return <Line data={data} options={options} />;
  };

  return (
    <div className="animate-fade-in" style={{ marginBottom: "50px" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, textAlign: "left" }}>Dream Planner Pro 🚀</h2>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            Klik kartu untuk lihat detail & absen.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn"
          style={{ width: "auto", padding: "12px 25px" }}
        >
          {showForm ? "Batal" : "+ Mimpi Baru"}
        </button>
      </div>

      {/* FORM TAMBAH (Sama seperti V2) */}
      {showForm && (
        <div
          className="auth-card-clean"
          style={{
            maxWidth: "100%",
            marginBottom: "30px",
            border: "2px dashed var(--primary)",
          }}
        >
          <form
            onSubmit={handleAddGoal}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <div className="form-control" style={{ marginBottom: 0 }}>
              <label>Nama Impian</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Rumah"
                required
              />
            </div>
            <div className="form-control" style={{ marginBottom: 0 }}>
              <label>Target Harga (Rp)</label>
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
              <label>Komitmen Nabung (Rp)</label>
              <input
                type="text"
                value={savingRaw}
                onChange={(e) =>
                  handleCurrencyInput(e.target.value, setSavingRaw)
                }
                placeholder="Rp"
                required
              />
            </div>
            <div className="form-control" style={{ marginBottom: 0 }}>
              <label>Frekuensi</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="Harian">Harian</option>
                <option value="Mingguan">Mingguan</option>
                <option value="Bulanan">Bulanan</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <button className="btn">Mulai Perjuangan! 🔥</button>
            </div>
          </form>
        </div>
      )}

      {/* --- CARD GRID (LIST DEPAN) --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "25px",
        }}
      >
        {goals.map((goal) => {
          const percent = Math.min((goal.current / goal.target) * 100, 100);
          const remaining = goal.target - goal.current;

          return (
            <div
              key={goal.id}
              onClick={() => setSelectedGoal(goal)} // KLIK UNTUK BUKA MODAL
              style={{
                background: "var(--bg-card)",
                padding: "25px",
                borderRadius: "20px",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <button
                onClick={(e) => handleDelete(goal.id, e)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                ×
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "20px",
                }}
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
                  <h3
                    style={{
                      margin: 0,
                      border: "none",
                      padding: 0,
                      fontSize: "1.1rem",
                    }}
                  >
                    {goal.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Target: {formatRupiah(goal.target)}
                  </span>
                </div>
              </div>

              {/* Progress Bar Mini */}
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "var(--primary)" }}>
                    {percent.toFixed(1)}%
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    {formatRupiah(goal.current)}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "var(--bg-main)",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background: goal.color,
                      borderRadius: "10px",
                    }}
                  ></div>
                </div>
              </div>

              {/* Tombol Setor Cepat */}
              {remaining > 0 ? (
                <button
                  onClick={(e) => handleDeposit(goal.id, e)}
                  className="btn"
                  style={{
                    background: "var(--bg-main)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    boxShadow: "none",
                    fontSize: "0.9rem",
                    padding: "10px",
                  }}
                >
                  <i
                    className="fas fa-plus-circle"
                    style={{ color: goal.color }}
                  ></i>{" "}
                  Setor Cepat
                </button>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "var(--success)",
                  }}
                >
                  🎉 LUNAS!
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- MODAL DETAIL POP-UP (PORTAL) --- */}
      {selectedGoal &&
        ReactDOM.createPortal(
          <div
            className="avatar-modal-overlay"
            onClick={() => setSelectedGoal(null)}
            style={{ zIndex: 2000 }}
          >
            <div
              className="avatar-modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--bg-card)",
                width: "600px",
                maxWidth: "95%",
                padding: "30px",
                overflowY: "auto",
                maxHeight: "90vh",
                cursor: "default",
              }}
            >
              {/* Header Modal */}
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <div style={{ fontSize: "2rem" }}>{selectedGoal.icon}</div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.5rem" }}>
                      {selectedGoal.title}
                    </h2>
                    <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                      Komitmen: {formatRupiah(selectedGoal.savingAmount)} /{" "}
                      {selectedGoal.frequency}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGoal(null)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Konten Modal */}
              <div style={{ display: "grid", gap: "30px" }}>
                {/* 1. Grafik Pertumbuhan */}
                <div>
                  <h4 style={{ marginBottom: "10px" }}>
                    📈 Grafik Pertumbuhan
                  </h4>
                  <div
                    style={{
                      height: "200px",
                      width: "100%",
                      background: "var(--bg-main)",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    {selectedGoal.logs.length > 0 ? (
                      renderChart(selectedGoal)
                    ) : (
                      <p
                        style={{
                          textAlign: "center",
                          paddingTop: "80px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Belum ada data setoran.
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Tracker Absen (Kotak-Kotak) */}
                <div>
                  <h4 style={{ marginBottom: "10px" }}>
                    ✅ Tracker Absen ({selectedGoal.frequency})
                  </h4>
                  {renderTrackerGrid(selectedGoal)}
                </div>

                {/* 3. Action Button Besar */}
                {selectedGoal.current < selectedGoal.target && (
                  <button
                    onClick={(e) => handleDeposit(selectedGoal.id, e)}
                    className="btn"
                    style={{
                      background: selectedGoal.color,
                      fontSize: "1.1rem",
                      padding: "15px",
                    }}
                  >
                    <i className="fas fa-plus-circle"></i> Setor Tabungan (
                    {formatRupiah(selectedGoal.savingAmount)})
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
