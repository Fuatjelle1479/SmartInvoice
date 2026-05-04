import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const [form, setForm] = useState({
    shopName: "",
    phone: "",
    email: "",
    password: "",
    location: "",
    profilePic: "",
  });

  /* ================= AUTO LOGIN ================= */
  useEffect(() => {
  const savedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (savedUser) {
    navigate("/");
  }
}, [navigate]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= FILE UPLOAD ================= */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (!form.phone && !form.email) {
      return alert("Use email OR phone");
    }

    if (!form.password) {
      return alert("Password is required");
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const identifier = form.email || form.phone;

    /* ================= DUPLICATE CHECK ================= */
    const exists = users.find(
      (u) => u.email === form.email || u.phone === form.phone
    );

    if (isRegister && exists) {
      return alert("User already registered");
    }

    /* ================= REGISTER ================= */
    if (isRegister) {
      const newUser = {
        id: crypto.randomUUID(),
        shopName: form.shopName,
        phone: form.phone,
        email: form.email,
        password: form.password,
        location: form.location,
        profilePic: form.profilePic,
      };

      localStorage.setItem("users", JSON.stringify([...users, newUser]));

      saveSession(newUser);
      return navigate("/");
    }

    /* ================= LOGIN ================= */
    const user = users.find(
      (u) =>
        (u.email === identifier || u.phone === identifier) &&
        u.password === form.password
    );

    if (!user) {
      return alert("Invalid credentials");
    }

    saveSession(user);
    navigate("/");
  };

  /* ================= SAVE SESSION ================= */
  const saveSession = (user) => {
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  };

  return (
    <div style={page}>
      <div style={box}>
        <h2>{isRegister ? "Register Account" : "Login"}</h2>

        {/* PROFILE IMAGE */}
        {isRegister && (
          <>
            <label style={{ fontSize: 14 }}>Profile Photo</label>

            <input type="file" accept="image/*" onChange={handleFile} />
          </>
        )}

        {/* SHOP NAME */}
        {isRegister && (
          <input
            name="shopName"
            placeholder="Shop Name"
            onChange={handleChange}
            style={input}
          />
        )}

        {/* EMAIL / PHONE LOGIN */}
        <input
          name="email"
          placeholder="Email (optional)"
          onChange={handleChange}
          style={input}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          style={input}
        />

        {/* PASSWORD */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={input}
        />

        {/* LOCATION */}
        {isRegister && (
          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            style={input}
          />
        )}

        {/* REMEMBER ME */}
        <div style={{ marginTop: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />{" "}
            Remember me
          </label>
        </div>

        {/* BUTTON */}
        <button onClick={handleSubmit} style={btn}>
          {isRegister ? "Register" : "Login"}
        </button>

        {/* SWITCH */}
        <p style={{ marginTop: 10 }}>
          {isRegister ? "Already have account?" : "No account?"}{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#f1f5f9",
};

const box = {
  background: "white",
  padding: 25,
  borderRadius: 10,
  width: 350,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  border: "1px solid #ddd",
  borderRadius: 6,
};

const btn = {
  width: "100%",
  padding: 12,
  marginTop: 15,
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};