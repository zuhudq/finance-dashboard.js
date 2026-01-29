import React, { useState, useEffect } from "react";
import axios from "axios";

export const MarketWatch = () => {
  const [marketData, setMarketData] = useState({
    btc: { price: 0, change: 0 },
    eth: { price: 0, change: 0 },
    usd: { price: 0, change: 0 }, // Change USD kita simulasi saja
  });

  const [loading, setLoading] = useState(true);

  // --- BERITA DUMMY (Biar Tampilannya Selalu Bagus) ---
  const news = [
    {
      id: 1,
      title: "IHSG Diprediksi Menguat, Cek Saham Pilihan Hari Ini",
      source: "CNBC Indonesia",
      time: "1 Jam lalu",
      tag: "Saham",
    },
    {
      id: 2,
      title: "Harga Emas Antam Naik Tipis, Saatnya Jual atau Beli?",
      source: "Kompas Finance",
      time: "3 Jam lalu",
      tag: "Emas",
    },
    {
      id: 3,
      title: "Bitcoin Tembus All Time High Baru, Investor Cuan Lebar",
      source: "CoinDesk ID",
      time: "5 Jam lalu",
      tag: "Crypto",
    },
    {
      id: 4,
      title: "Tips Mengatur Cashflow di Tengah Isu Resesi Global",
      source: "Bisnis.com",
      time: "Hari ini",
      tag: "Tips",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ambil Harga Crypto (CoinGecko API)
        const cryptoRes = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=idr&include_24hr_change=true",
        );

        // 2. Ambil Kurs Dollar (Frankfurter API)
        const usdRes = await axios.get(
          "https://api.frankfurter.app/latest?from=USD&to=IDR",
        );

        setMarketData({
          btc: {
            price: cryptoRes.data.bitcoin.idr,
            change: cryptoRes.data.bitcoin.idr_24h_change,
          },
          eth: {
            price: cryptoRes.data.ethereum.idr,
            change: cryptoRes.data.ethereum.idr_24h_change,
          },
          usd: {
            price: usdRes.data.rates.IDR,
            change: 0.5, // Simulasi naik dikit
          },
        });
        setLoading(false);
      } catch (err) {
        console.log("Gagal ambil data market", err);
        // Kalau error (misal limit habis), pakai data dummy biar gak blank
        setLoading(false);
      }
    };

    fetchData();
    // Refresh tiap 60 detik (Opsional)
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercent = (num) => {
    return num ? `${num.toFixed(2)}%` : "0%";
  };

  return (
    <div
      className="budget-container"
      style={{
        marginTop: "30px",
        animation: "fadeInUp 0.8s ease-out",
        borderTop: "4px solid var(--primary)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>📈</span>
        <h3
          style={{
            margin: 0,
            border: "none",
            fontSize: "1.3rem",
            color: "var(--text-primary)",
          }}
        >
          Market Watch
        </h3>
      </div>

      {/* --- LIVE TICKER (3 KARTU) --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        {/* BITCOIN */}
        <div
          style={{
            background: "var(--bg-main)",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "var(--text-primary)" }}>
              Bitcoin (BTC)
            </span>
            <i
              className="fab fa-bitcoin"
              style={{ color: "#f7931a", fontSize: "1.2rem" }}
            ></i>
          </div>
          {loading ? (
            <small>Loading...</small>
          ) : (
            <>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                }}
              >
                {formatRupiah(marketData.btc.price)}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color:
                    marketData.btc.change >= 0
                      ? "var(--success)"
                      : "var(--danger)",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {marketData.btc.change >= 0 ? "▲" : "▼"}{" "}
                {formatPercent(marketData.btc.change)}
              </div>
            </>
          )}
        </div>

        {/* ETHEREUM */}
        <div
          style={{
            background: "var(--bg-main)",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "var(--text-primary)" }}>
              Ethereum (ETH)
            </span>
            <i
              className="fab fa-ethereum"
              style={{ color: "#627eea", fontSize: "1.2rem" }}
            ></i>
          </div>
          {loading ? (
            <small>Loading...</small>
          ) : (
            <>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                }}
              >
                {formatRupiah(marketData.eth.price)}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color:
                    marketData.eth.change >= 0
                      ? "var(--success)"
                      : "var(--danger)",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {marketData.eth.change >= 0 ? "▲" : "▼"}{" "}
                {formatPercent(marketData.eth.change)}
              </div>
            </>
          )}
        </div>

        {/* USD CURRENCY */}
        <div
          style={{
            background: "var(--bg-main)",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "var(--text-primary)" }}>
              USD / IDR
            </span>
            <i
              className="fas fa-dollar-sign"
              style={{ color: "#00b894", fontSize: "1.2rem" }}
            ></i>
          </div>
          {loading ? (
            <small>Loading...</small>
          ) : (
            <>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                }}
              >
                {formatRupiah(marketData.usd.price)}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--success)",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                ▲ Stabil
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- NEWS SECTION --- */}
      <h4 style={{ marginBottom: "15px", color: "var(--text-secondary)" }}>
        Berita Terkini
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {news.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px",
              borderRadius: "10px",
              borderLeft: `4px solid var(--primary)`,
              background: "var(--bg-card)",
              boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
              transition: "transform 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateX(5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateX(0)")
            }
          >
            <div>
              <div
                style={{
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "5px",
                }}
              >
                {item.title}
              </div>
              <div
                style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
              >
                <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
                  {item.source}
                </span>{" "}
                • {item.time}
              </div>
            </div>
            <span
              style={{
                fontSize: "0.7rem",
                padding: "4px 8px",
                borderRadius: "20px",
                background: "var(--bg-main)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
