import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user"))
      );
    } catch {
      return null;
    }
  }, []);

  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    const key = `customers_${user.email}`;
    const data = JSON.parse(localStorage.getItem(key) || "[]");

    setCustomers(data);
  }, [user?.email]);

  const save = (data) => {
    const key = `customers_${user.email}`;
    localStorage.setItem(key, JSON.stringify(data));
    setCustomers(data);
  };

  const addCustomer = () => {
    if (!name || !phone) return alert("Enter name & phone");

    const newCustomer = {
      id: crypto.randomUUID(),
      name,
      phone,
      debts: [],
    };

    save([...customers, newCustomer]);
    setName("");
    setPhone("");
  };

  const deleteCustomer = (id) => {
    save(customers.filter((c) => c.id !== id));
  };

  const editCustomer = (id) => {
    const newName = prompt("Edit name:");
    const newPhone = prompt("Edit phone:");

    if (!newName || !newPhone) return;

    save(
      customers.map((c) =>
        c.id === id ? { ...c, name: newName, phone: newPhone } : c
      )
    );
  };

  if (!user) return <h3>Login required</h3>;

  return (
    <div style={page}>
      <h2>Customers</h2>

      {/* ADD CUSTOMER */}
      <div style={addBox}>
        <input
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={input}
        />

        <button style={addBtn} onClick={addCustomer}>
          ➕ Add Customer
        </button>
      </div>

      {/* GRID */}
      <div style={grid}>
        {customers.map((c) => (
          <div key={c.id} style={card}>
            {/* TOP */}
            <div style={topRow}>
              <div style={nameStyle}>{c.name}</div>
              <div style={phoneStyle}>📞 {c.phone}</div>
              <div style={phoneIcon}>📱</div>
            </div>

            {/* ACTIONS */}
            <div style={actions}>
              <button
                style={invoiceBtn}
                onClick={() => navigate(`/invoice/${c.id}`)}
              >
                📄
              </button>

              <button
                style={editBtn}
                onClick={() => editCustomer(c.id)}
              >
                ✏️
              </button>

              <button
                style={deleteBtn}
                onClick={() => deleteCustomer(c.id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  maxWidth: 900,
  margin: "auto",
  padding: 15,
  fontFamily: "Arial",
};

const addBox = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginBottom: 20,
  alignItems: "center", // 👈 centers the button + inputs
};

const input = {
  padding: 5,
  fontSize: 25,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const addBtn = {
  background: "green",
  color: "white",
  padding: 12,
  fontSize: 16,
  border: "none",
  borderRadius: 6,
};

/* ✅ GRID (4 columns) */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
};

/* SMALL SQUARE CARD */
const card = {
  background: "white",
  borderRadius: 10,
  padding: 8,
  height: 185,   // 🔥 smaller height
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};
/* TOP SECTION */
const topRow = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
};
const nameStyle = {
  fontSize: 25,
  fontWeight: "bold",
};

const phoneStyle = {
  fontSize: 25,
  color: "#555",
};

const phoneIcon = {
  fontSize: 35,   // 🔥 bigger icon
  color: "red",
};
/* ACTIONS */
const actions = {
  display: "flex",
  gap: 6,
  marginTop: 6,
};

const invoiceBtn = {
  flex: 0.3,
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "10px 0",
  fontSize: 25,
  fontWeight: "bold",
};

const editBtn = {
  flex: 0.3,
  background: "#f59e0b",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "10px 0",
  fontSize: 25,
  fontWeight: "bold",
};

const deleteBtn = {
  flex: 0.3,
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "10px 0",
  fontSize: 25,
  fontWeight: "bold",
};