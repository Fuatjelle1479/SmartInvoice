import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Invoice from "../pages/Invoice";
import Login from "../pages/Login";

/* 🔐 SAFE AUTH CHECK */
function isAuth() {
  try {
    const user =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    return !!user;
  } catch {
    return false;
  }
}

/* 🔐 wrapper for protected pages */
function ProtectedRoute({ children }) {
  return isAuth() ? children : <Navigate to="/login" replace />;
}

/* 🔓 wrapper for login page */
function PublicRoute({ children }) {
  return isAuth() ? <Navigate to="/" replace /> : children;
}

export default function AppRoutes() {
  return (
    <Routes>

      {/* LOGIN PAGE */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* APP (PROTECTED AREA) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* DASHBOARD */}
        <Route index element={<Dashboard />} />

        {/* INVOICE */}
        <Route path="invoice/:id" element={<Invoice />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}