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

    <div style={addBox}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={input}
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={input}
      />
      <button onClick={addCustomer} style={addBtn}>
        Add Customer
      </button>
    </div>

    {/* GRID */}
    <div style={grid}>
      {customers.map((c) => (
        <div key={c.id} style={card}>
          
          {/* TOP */}
          <div style={topRow}>
            <div style={textBox}>
              <div style={nameStyle}>{c.name}</div>
              <div style={phoneStyle}>📞 {c.phone}</div>
            </div>

            <div style={phoneIcon}>📱</div>
          </div>

          {/* ACTIONS */}
          <div style={actions}>
            <button
              style={{ ...btnBase, ...invoiceBtn }}
              onClick={() => navigate(`/invoice/${c.id}`)}
            >
              📄 <span style={btnText}>Invoice</span>
            </button>

            <button
              style={{ ...btnBase, ...editBtn }}
              onClick={() => editCustomer(c.id)}
            >
              ✏️ <span style={btnText}>Edit</span>
            </button>

            <button
              style={{ ...btnBase, ...deleteBtn }}
              onClick={() => deleteCustomer(c.id)}
            >
              🗑 <span style={btnText}>Delete</span>
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
  width: "100%",
  maxWidth: 600,
  margin: "0 auto",
  padding: 12,
  boxSizing: "border-box",
};

/* ADD CUSTOMER SECTION */
const addBox = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginBottom: 20,
  alignItems: "center",
};

const input = {
  width: "100%",
  padding: 12,
  fontSize: 16,
  borderRadius: 8,
  border: "1px solid #ccc",
  outline: "none",
};

const addBtn = {
  width: "100%",
  background: "green",
  color: "white",
  padding: 14,
  fontSize: 16,
  border: "none",
  borderRadius: 8,
};

/* GRID */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 10,
};

/* CUSTOMER CARD */
const card = {
  background: "white",
  borderRadius: 12,
  padding: 10,
  minHeight: 160,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

/* TOP ROW */
const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const textBox = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  maxWidth: "70%",
  textAlign: "left",
};

const nameStyle = {
  fontSize: 16,
  fontWeight: "bold",
};

const phoneStyle = {
  fontSize: 13,
  color: "#666",
};

const phoneIcon = {
  fontSize: 28,
  color: "red",
};

/* ACTIONS (ONLY ONE — FIXED) */
const actions = {
  display: "flex",
  gap: 6,
  marginTop: 8,
};

/* BUTTON BASE */
const btnBase = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: 10,
  borderRadius: 8,
  border: "none",
  fontSize: 14,
  cursor: "pointer",
};

/* BUTTON COLORS */
const invoiceBtn = {
  background: "#2563eb",
  color: "white",
};

const editBtn = {
  background: "#f59e0b",
  color: "white",
};

const deleteBtn = {
  background: "#dc2626",
  color: "white",
};

const btnText = {
  fontSize: 11,
  marginTop: 2,
};
