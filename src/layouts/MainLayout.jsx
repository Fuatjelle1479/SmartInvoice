import { useNavigate, Outlet } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={container}>
      {/* SIDEBAR */}
      <div style={sidebar}>
        <h2 style={{ marginBottom: 20 }}>SmartInvoice</h2>

        <button style={linkBtn} onClick={() => navigate("/")}>
          📊 Dashboard
        </button>

        {/* Removed Customers page (not needed anymore) */}
        <div style={{ flex: 1 }} />

        <button style={logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={content}>
        <Outlet />
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const container = {
  display: "flex",
  minHeight: "100vh",
};

const sidebar = {
  width: 220,
  background: "#0f172a",
  color: "white",
  padding: 20,
  display: "flex",
  flexDirection: "column",
};

const content = {
  flex: 1,
  padding: 20,
  background: "#f1f5f9",
};

const linkBtn = {
  padding: "10px",
  textAlign: "left",
  background: "transparent",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: 6,
  marginBottom: 8,
};

const logoutBtn = {
  padding: "10px",
  background: "#dc2626",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: 6,
};