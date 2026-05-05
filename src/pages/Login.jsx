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

      if (parsed?.profile?.email || parsed?.profile?.phone) {
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
    if (isRegister && !form.shopName) return alert("Shop name required");

    if (!form.identifier && !isRegister)
      return alert("Enter email or phone");

    if (!form.phone && !form.email && isRegister)
      return alert("Use email OR phone");

    if (!form.password) return alert("Password is required");

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const normalizePhone = (p) =>
      (p || "").replace(/\s+/g, "").replace("+", "");

    const identifier = form.identifier?.trim();
    const isEmail = identifier?.includes("@");

    /* ================= FIXED DUPLICATE CHECK ================= */
const exists = users.some((u) => {
  const email = u.profile?.email?.trim()?.toLowerCase();
  const phone = normalizePhone(u.profile?.phone);

  const inputEmail = form.email?.trim()?.toLowerCase();
  const inputPhone = form.phone ? normalizePhone(form.phone) : null;

  const emailMatch =
    inputEmail && email === inputEmail;

  const phoneMatch =
    inputPhone && phone === inputPhone;

  return emailMatch || phoneMatch;
});

    /* ================= REGISTER ================= */
    if (isRegister) {
      const newUser = {
        id: crypto.randomUUID(),

        profile: {
          shopName: form.shopName,
          email: form.email?.trim() || null,
          phone: form.phone?.trim() || null,
          location: form.location || "",
          profilePic: form.profilePic || "",
        },

        auth: {
          password: form.password,
        },

        payment: form.paymentType
          ? {
              type: form.paymentType,
              agentNumber: form.agentNumber || null,
              storeNumber: form.storeNumber || null,
              tillNumber: form.tillNumber || null,
              pochiNumber: form.pochiNumber || null,
              sendMoneyNumber: form.sendMoneyNumber || null,
              paybillNumber: form.paybillNumber || null,
              accountNumber: form.accountNumber || null,
            }
          : null,

        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("users", JSON.stringify([...users, newUser]));

      saveSession(newUser);
      return navigate("/");
    }

    /* ================= LOGIN (FIXED STABLE LOGIC) ================= */
/* ================= LOGIN (FIXED STABLE LOGIC) ================= */
const cleanIdentifier = identifier?.trim()?.toLowerCase();


const normalizedPhoneInput = cleanIdentifier
  ? normalizePhone(cleanIdentifier)
  : null;

const user = users.find((u) => {
  const email = u.profile?.email?.trim()?.toLowerCase();
  const phone = normalizePhone(u.profile?.phone);

  const emailMatch =
    isEmail && email === cleanIdentifier;

  const phoneMatch =
    !isEmail &&
    normalizedPhoneInput &&
    phone === normalizedPhoneInput;

  const passwordMatch = u.auth?.password === form.password;

  return passwordMatch && (emailMatch || phoneMatch);
});

if (!user) return alert("Invalid credentials");

saveSession(user);
navigate("/");

  /* ================= RESET USERS ================= */
  const resetUsers = () => {
    localStorage.removeItem("users");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    alert("All users cleared. You can register fresh.");
    window.location.reload();
  };
  
  const handleForgotPassword = () => {
  const identifier = prompt("Enter your Email or Phone");
  if (!identifier) return;

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const userIndex = users.findIndex((u) => {
    const email = u.profile?.email?.trim()?.toLowerCase();
    const phone = u.profile?.phone?.trim();

    const input = identifier.trim().toLowerCase();

    return email === input || phone === identifier.trim();
  });

  if (userIndex === -1) return alert("User not found");

  const newPassword = prompt("Enter new password");

  if (!newPassword || newPassword.length < 4) {
    return alert("Password too short (min 4 chars)");
  }

  users[userIndex].auth.password = newPassword;

  localStorage.setItem("users", JSON.stringify(users));

  alert("Password reset successful. You can now login.");
};
  return (
    <div style={page}>
      <div style={box}>
        <h2>{isRegister ? "Register Account" : "Login"}</h2>

        {isRegister && (
          <>
            <label style={{ fontSize: 14 }}>Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleFile} />
          </>
        )}

        {isRegister && (
          <input
            name="shopName"
            placeholder="Shop Name"
            onChange={handleChange}
            style={input}
          />
        )}

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

        {!isRegister && (
          <input
            name="identifier"
            placeholder="Email or Phone"
            onChange={handleChange}
            style={input}
          />
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={input}
        />

        {!isRegister && (
          <p
            style={{
              marginTop: 8,
              marginBottom: 10,
              color: "blue",
              cursor: "pointer",
              fontSize: 13,
              textAlign: "right",
            }}
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </p>
        )}

        {isRegister && (
          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            style={input}
          />
        )}

        {isRegister && (
          <select name="paymentType" onChange={handleChange} style={input}>
            <option value="">Select Payment Mode</option>
            <option value="agent">Agent Number</option>
            <option value="till">Till Number</option>
            <option value="pochi">Pochi la Biashara</option>
            <option value="sendmoney">Send Money</option>
            <option value="paybill">PayBill</option>
          </select>
        )}

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

        <button onClick={handleSubmit} style={btn}>
          {isRegister ? "Register" : "Login"}
        </button>

        <button
          onClick={resetUsers}
          style={{
            marginTop: 10,
            background: "red",
            color: "white",
            padding: 14,
            width: "100%",
            border: "none",
            borderRadius: 8,
          }}
        >
          Reset Users (Dev Mode)
        </button>

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
}