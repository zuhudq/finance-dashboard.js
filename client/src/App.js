import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { GlobalProvider } from "./context/GlobalState";
import "./App.css";

// Komponen
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Profile } from "./components/Profile";

// Pages
import { DashboardPage } from "./components/pages/DashboardPage";
import { TransactionsPage } from "./components/pages/TransactionsPage";
import { BudgetPage } from "./components/pages/BudgetPage";
import { DreamsPage } from "./components/pages/DreamsPage";
import { MarketPage } from "./components/pages/MarketPage";

// Layout Khusus dengan Mobile Toggle
const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebar = ["/login", "/register"];
  const showNav = !hideSidebar.includes(location.pathname);

  // State untuk Sidebar Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {showNav && (
        <Sidebar
          isOpen={isSidebarOpen}
          closeMenu={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        style={{
          flex: 1,
          // Margin kiri cuma ada di Desktop (Layar > 768px diatur CSS)
          // Di sini kita pakai class CSS saja biar responsif
          width: "100%",
          transition: "margin-left 0.3s ease",
        }}
        className={showNav ? "main-content-with-sidebar" : ""}
      >
        {showNav && (
          <>
            {/* TOMBOL HAMBURGER (MOBILE ONLY) */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsSidebarOpen(true)}
            >
              <i className="fas fa-bars"></i>
            </button>

            <Header />
          </>
        )}

        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    </div>
  );
};

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Layout>
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/dreams" element={<DreamsPage />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Layout>
      </Router>
    </GlobalProvider>
  );
}

export default App;
