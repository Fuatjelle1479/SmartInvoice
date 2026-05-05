import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={container}>
      {/* TOP BAR */}
      <div style={topBar}>
        <span style={logo}>SmartInvoice</span>
      </div>

      {/* MAIN CONTENT */}
      <div style={content}>
        <Outlet />
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div style={bottomNav}>
        <button
          style={{
            ...navBtn,
            color: location.pathname === "/" ? "#38bdf8" : "#fff",
          }}
          onClick={() => navigate("/")}
        >
          📊
          <span style={label}>Home</span>
        </button>

        <button style={navBtn} onClick={handleLogout}>
          🚪
          <span style={label}>Logout</span>
        </button>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const container = {
  minHeight: "100vh",
  background: "#f1f5f9",
  display: "flex",
  flexDirection: "column",
};

/* TOP BAR */
const topBar = {
  height: 55,
  background: "#0f172a",
  color: "white",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  fontWeight: "bold",
  fontSize: 16,
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const logo = {
  letterSpacing: 0.5,
};

/* CONTENT */
const content = {
  flex: 1,
  padding: 12,
  paddingBottom: 80, // space for bottom nav
  width: "100%",
  maxWidth: 600,
  margin: "0 auto",
  boxSizing: "border-box",
};

/* BOTTOM NAV */
const bottomNav = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: 65,
  background: "#0f172a",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
};

/* NAV BUTTON */
const navBtn = {
  background: "transparent",
  color: "white",
  border: "none",
  fontSize: 20,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  flex: 1,
  padding: "6px 0",
};

/* LABEL */
const label = {
  fontSize: 10,
};