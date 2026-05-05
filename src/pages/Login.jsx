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
    identifier: "",

    /* 🔥 NEW PAYMENT MODE */
    paymentType: "",
    agentNumber: "",
    storeNumber: "",
    tillNumber: "",
    pochiNumber: "",
    sendMoneyNumber: "",
    paybillNumber: "",
    accountNumber: "",
  });

  /* ================= AUTO LOGIN ================= */
  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (!savedUser) return;

      const parsed = JSON.parse(savedUser);

      if (parsed?.email || parsed?.phone) {
        navigate("/");
      }
    } catch {
      console.log("Invalid stored user");
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
    if (isRegister && !form.shopName) {
      return alert("Shop name required");
    }

    if (!form.identifier && !isRegister) {
      return alert("Enter email or phone");
    }

    if (!form.phone && !form.email && isRegister) {
      return alert("Use email OR phone");
    }

    if (!form.password) {
      return alert("Password is required");
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const identifier = form.identifier || form.email || form.phone;

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

        payment: form.paymentType
  ? {
      type: form.paymentType,
      agentNumber: form.agentNumber,
      storeNumber: form.storeNumber,
      tillNumber: form.tillNumber,
      pochiNumber: form.pochiNumber,
      sendMoneyNumber: form.sendMoneyNumber,
      paybillNumber: form.paybillNumber,
      accountNumber: form.accountNumber,
    }
  : null,
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
const handleForgotPassword = () => {
  const identifier = prompt("Enter your Email or Phone");

  if (!identifier) return;

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const userIndex = users.findIndex(
    (u) =>
      (u.email && u.email === identifier) ||
      (u.phone && u.phone === identifier)
  );

  if (userIndex === -1) {
    return alert("User not found");
  }

  const newPassword = prompt("Enter new password");

  if (!newPassword || newPassword.length < 4) {
    return alert("Password too short (min 4 chars)");
  }

  users[userIndex].password = newPassword;

  localStorage.setItem("users", JSON.stringify(users));

  alert("Password reset successful. You can now login.");
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

        {/* REGISTER EMAIL + PHONE */}
        {isRegister && (
          <>
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              style={input}
            />

            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              style={input}
            />
          </>
        )}

        {/* LOGIN IDENTIFIER */}
        {!isRegister && (
          <input
            name="identifier"
            placeholder="Email or Phone"
            onChange={handleChange}
            style={input}
          />
        )}

        {/* PASSWORD */}
        {/* PASSWORD */}
<input
  name="password"
  type="password"
  placeholder="Password"
  onChange={handleChange}
  style={input}
/>

{/* FORGOT PASSWORD */}
{!isRegister && (
  <p
    style={{
      marginTop: 8,
      marginBottom: 10,
      color: "blue",
      cursor: "pointer",
      fontSize: 13,
      textAlign: "right"
    }}
    onClick={handleForgotPassword}
  >
    Forgot Password?
  </p>
)}
        {/* LOCATION */}
        {isRegister && (
          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            style={input}
          />
        )}

        {/* 🔥 PAYMENT MODE SELECT */}
        {isRegister && (
          <>
            <select
              name="paymentType"
              onChange={handleChange}
              style={input}
            >
              <option value="">Select Payment Mode</option>
              <option value="agent">Agent Number</option>
              <option value="till">Till Number</option>
              <option value="pochi">Pochi la Biashara</option>
              <option value="sendmoney">Send Money</option>
              <option value="paybill">PayBill</option>
            </select>

            {/* CONDITIONAL FIELDS */}
            {form.paymentType === "agent" && (
              <>
                <input
                  name="agentNumber"
                  placeholder="Agent Number"
                  onChange={handleChange}
                  style={input}
                />
                <input
                  name="storeNumber"
                  placeholder="Store Number"
                  onChange={handleChange}
                  style={input}
                />
              </>
            )}

            {form.paymentType === "till" && (
              <input
                name="tillNumber"
                placeholder="Till Number"
                onChange={handleChange}
                style={input}
              />
            )}

            {form.paymentType === "pochi" && (
              <input
                name="pochiNumber"
                placeholder="Pochi Number"
                onChange={handleChange}
                style={input}
              />
            )}

            {form.paymentType === "sendmoney" && (
              <input
                name="sendMoneyNumber"
                placeholder="Send Money Number"
                onChange={handleChange}
                style={input}
              />
            )}

            {form.paymentType === "paybill" && (
              <>
                <input
                  name="paybillNumber"
                  placeholder="PayBill Number"
                  onChange={handleChange}
                  style={input}
                />
                <input
                  name="accountNumber"
                  placeholder="Account Number"
                  onChange={handleChange}
                  style={input}
                />
              </>
            )}
          </>
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
  minHeight: "100vh",
  padding: 12,
  background: "#f1f5f9",
};

const box = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  width: "100%",
  maxWidth: 380,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: 14,
  marginTop: 10,
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 14,
};

const btn = {
  width: "100%",
  padding: 14,
  marginTop: 15,
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: 8,
  fontSize: 15,
};