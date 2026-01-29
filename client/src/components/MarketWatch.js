import React, { useState, useEffect } from "react";
import axios from "axios";

// Variabel di luar komponen biar gak kena warning dependency
const fallbackNews = [
  {
    title: "Prediksi IHSG Hari Ini: Sektor Perbankan Menguat Tajam",
    source: "CNBC Indonesia",
    url: "https://www.cnbcindonesia.com/market",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "Harga Emas Antam Turun Tipis, Waktu Tepat untuk Serok?",
    source: "Kompas Money",
    url: "https://money.kompas.com/",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "Bitcoin Kembali ke Level $95.000, Altcoin Ikut Terbang",
    source: "CoinDesk",
    url: "https://www.coindesk.com/",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "Tips Mengatur Gaji UMR Agar Bisa Investasi Rutin",
    source: "Detik Finance",
    url: "https://finance.detik.com/",
    publishedAt: new Date().toISOString(),
  },
  {
    title: "Resesi Global 2026: Mitos atau Fakta? Ini Kata Ahli",
    source: "Bisnis.com",
    url: "https://ekonomi.bisnis.com/",
    publishedAt: new Date().toISOString(),
  },
];

export const MarketWatch = () => {
  const [marketData, setMarketData] = useState({
    btc: { price: 0, change: 0 },
    eth: { price: 0, change: 0 },
    sol: { price: 0, change: 0 },
    xrp: { price: 0, change: 0 },
    gold: { price: 0, change: 0 },
    usd: { price: 0, change: 0 },
  });

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. AMBIL HARGA PASAR
        const cryptoRes = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,pax-gold&vs_currencies=idr&include_24hr_change=true",
        );
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
          sol: {
            price: cryptoRes.data.solana.idr,
            change: cryptoRes.data.solana.idr_24h_change,
          },
          xrp: {
            price: cryptoRes.data.ripple.idr,
            change: cryptoRes.data.ripple.idr_24h_change,
          },
          gold: {
            price: cryptoRes.data["pax-gold"].idr,
            change: cryptoRes.data["pax-gold"].idr_24h_change,
          },
          usd: { price: usdRes.data.rates.IDR, change: 0.15 },
        });

        // 2. AMBIL BERITA
        // Masukkan API Key kamu di sini
        const API_KEY = "MASUKKAN_API_KEY_KAMU_DISINI";

        if (API_KEY !== "MASUKKAN_API_KEY_KAMU_DISINI") {
          const newsRes = await axios.get(
            `https://gnews.io/api/v4/top-headlines?category=business&lang=id&country=id&max=6&apikey=${API_KEY}`,
          );
          setArticles(newsRes.data.articles);
        } else {
          setArticles(fallbackNews.sort(() => 0.5 - Math.random()));
        }

        setLoading(false);
      } catch (err) {
        console.log("Gagal refresh data, gunakan fallback.");
        setArticles(fallbackNews);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []); // Dependency array kosong sudah aman karena variabel statis ada di luar

  return (
    <div className="animate-fade-in" style={{ marginBottom: "80px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ textAlign: "left", margin: 0 }}>Pasar & Berita 🌏</h2>
        <span
          style={{
            fontSize: "0.8rem",
            color: "var(--success)",
            background: "rgba(0,184,148,0.1)",
            padding: "5px 10px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              background: "var(--success)",
              borderRadius: "50%",
              display: "inline-block",
            }}
          ></span>
          Live Update
        </span>
      </div>

      {/* LIVE TICKER GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginBottom: "40px",
        }}
      >
        <MarketCard
          title="Bitcoin (BTC)"
          price={marketData.btc.price}
          change={marketData.btc.change}
          icon="fab fa-bitcoin"
          color="#f7931a"
          loading={loading}
        />
        <MarketCard
          title="Ethereum (ETH)"
          price={marketData.eth.price}
          change={marketData.eth.change}
          icon="fab fa-ethereum"
          color="#627eea"
          loading={loading}
        />
        <MarketCard
          title="Solana (SOL)"
          price={marketData.sol.price}
          change={marketData.sol.change}
          icon="fas fa-layer-group"
          color="#9945FF"
          loading={loading}
        />
        <MarketCard
          title="Ripple (XRP)"
          price={marketData.xrp.price}
          change={marketData.xrp.change}
          icon="fas fa-exchange-alt"
          color="#346AA9"
          loading={loading}
        />
        <MarketCard
          title="Emas / Oz"
          price={marketData.gold.price}
          change={marketData.gold.change}
          icon="fas fa-coins"
          color="#FFD700"
          loading={loading}
        />
        <MarketCard
          title="USD / IDR"
          price={marketData.usd.price}
          change={marketData.usd.change}
          icon="fas fa-dollar-sign"
          color="#00b894"
          loading={loading}
        />
      </div>

      {/* NEWS SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid var(--border-color)",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ margin: 0 }}>Berita Terkini 📰</h3>
        <span
          style={{
            fontSize: "0.9rem",
            color: "var(--primary)",
            cursor: "pointer",
          }}
        >
          Lihat Semua →
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {articles.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div
              className="news-card"
              style={{
                height: "100%",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                padding: "0",
              }}
            >
              {item.image && (
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    overflow: "hidden",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                >
                  <img
                    src={item.image}
                    alt="News"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "0.3s",
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--primary)",
                    fontWeight: "bold",
                    marginBottom: "5px",
                    textTransform: "uppercase",
                  }}
                >
                  {item.source.name || item.source}
                </div>
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                    lineHeight: "1.5",
                    flex: 1,
                  }}
                >
                  {item.title}
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "auto",
                    paddingTop: "15px",
                    borderTop: "1px solid var(--border-color)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {new Date(item.publishedAt).toLocaleDateString("id-ID")}
                  </span>
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}
                  >
                    Baca{" "}
                    <i
                      className="fas fa-external-link-alt"
                      style={{ fontSize: "0.7rem" }}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// Sub-Component
const MarketCard = ({ title, price, change, icon, color, loading }) => {
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  const formatPercent = (num) => (num ? `${num.toFixed(2)}%` : "0%");
  const isPositive = change >= 0;

  return (
    <div
      className="market-card"
      style={{ borderLeft: `4px solid ${color}`, position: "relative" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}
      >
        <span
          style={{
            fontWeight: "600",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
          }}
        >
          {title}
        </span>
        <i
          className={icon}
          style={{ color: color, fontSize: "1.2rem", opacity: 0.8 }}
        ></i>
      </div>
      <h3
        style={{
          margin: "0 0 5px 0",
          border: "none",
          fontSize: "1.1rem",
          color: "var(--text-primary)",
        }}
      >
        {loading ? (
          <span
            className="skeleton-loading"
            style={{
              width: "80px",
              height: "20px",
              display: "block",
              background: "var(--border-color)",
              borderRadius: "4px",
            }}
          ></span>
        ) : (
          formatRupiah(price)
        )}
      </h3>
      <span
        style={{
          color: isPositive ? "var(--success)" : "var(--danger)",
          fontWeight: "bold",
          fontSize: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}
      >
        {isPositive ? "▲" : "▼"} {formatPercent(change)}
      </span>
    </div>
  );
};
