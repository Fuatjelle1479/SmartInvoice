import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";

export default function Invoice() {
  const { id } = useParams();

  const user = useMemo(() => {
    try {
      const raw =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (!user?.email || !id) return;

    const key = `customers_${user.email}`;
    const data = JSON.parse(localStorage.getItem(key) || "[]");

    setCustomers(data);
    setCustomer(data.find((c) => c.id === id) || null);
  }, [user?.email, id]);

  const save = (updated) => {
    const key = `customers_${user.email}`;
    localStorage.setItem(key, JSON.stringify(updated));

    setCustomers(updated);
    setCustomer(updated.find((c) => c.id === id));
  };

  if (!user) return <h3>Login required</h3>;
  if (!customer) return <h3>Customer not found</h3>;

  /* ➕ ADD RECEIPT */
  const generateInvoiceNo = (debts) => {
    const count = debts?.length || 0;
    return `#${String(count + 1).padStart(3, "0")}`;
  };

  const addReceipt = () => {
    const currentDebts =
      customers.find((c) => c.id === id)?.debts || [];

    const newReceipt = {
      id: crypto.randomUUID(),
      invoiceNo: generateInvoiceNo(currentDebts),
      date: new Date().toISOString().split("T")[0],
      items: [],
    };

    const updated = customers.map((c) =>
      c.id === id
        ? { ...c, debts: [...(c.debts || []), newReceipt] }
        : c
    );

    save(updated);
  };

  const deleteReceipt = () => {
    const updated = customers.map((c) =>
      c.id === id
        ? { ...c, debts: (c.debts || []).slice(0, -1) }
        : c
    );

    save(updated);
  };

  const addItem = (rid) => {
    const updated = customers.map((c) =>
      c.id === id
        ? {
            ...c,
            debts: c.debts.map((r) =>
              r.id === rid
                ? {
                    ...r,
                    items: [
                      ...(r.items || []),
                      { id: crypto.randomUUID(), name: "", price: 0 },
                    ],
                  }
                : r
            ),
          }
        : c
    );

    save(updated);
  };

  const updateItem = (rid, iid, value) => {
    const updated = customers.map((c) =>
      c.id === id
        ? {
            ...c,
            debts: c.debts.map((r) =>
              r.id === rid
                ? {
                    ...r,
                    items: r.items.map((i) =>
                      i.id === iid ? { ...i, ...value } : i
                    ),
                  }
                : r
            ),
          }
        : c
    );

    save(updated);
  };

  const deleteItem = (rid, iid) => {
    const updated = customers.map((c) =>
      c.id === id
        ? {
            ...c,
            debts: c.debts.map((r) =>
              r.id === rid
                ? {
                    ...r,
                    items: r.items.filter((i) => i.id !== iid),
                  }
                : r
            ),
          }
        : c
    );

    save(updated);
  };

  const getTotal = (items) =>
    (items || []).reduce((sum, i) => sum + Number(i.price || 0), 0);

  /* ✅ FIXED SHARE FUNCTION (PROPER SCOPE) */
  const shareInvoice = async (receiptId, method) => {
  const element = document.getElementById(`receipt-${receiptId}`);
  if (!element) return;

  const buttons = element.querySelectorAll("button");
  buttons.forEach((btn) => (btn.style.display = "none"));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  });

  buttons.forEach((btn) => (btn.style.display = ""));

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );

  const file = new File([blob], "invoice.png", {
    type: "image/png",
  });

  // ================= WHATSAPP =================
  if (method === "whatsapp") {
    const message = `Invoice from ${user.shopName} - ${customer.name}`;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "Invoice",
          text: message,
          files: [file],
        });
        return;
      } catch (err) {
        console.log(err);
      }
    }

    alert("Sharing not supported on this device");
  }

  // ================= SMS =================
  // SMS (FIXED - opens native app properly)
if (method === "sms") {
  const receipt = customer?.debts?.find((r) => r.id === receiptId);

  const message = `Invoice from ${user.shopName}
Customer: ${customer.name}
Phone: ${customer.phone}
Total: KES ${getTotal(receipt?.items || [])}`;

  const phone = (customer.phone || "")
    .replace(/\s+/g, "")
    .replace("+", "");

  const encoded = encodeURIComponent(message);

  // ANDROID + MOST DEVICES
  const androidSms = `sms:${phone}?body=${encoded}`;

  // iOS (IMPORTANT DIFFERENCE)
  const iosSms = `sms:${phone}&body=${encoded}`;

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const smsUrl = isIOS ? iosSms : androidSms;

  // IMPORTANT: direct navigation (no anchor tag)
  window.location.href = smsUrl;

  // fallback (only if blocked)
  setTimeout(() => {
    navigator.clipboard.writeText(message);
    alert("SMS opened. If not, paste manually in Messages app.");
  }, 800);
}
  }
  /* ================= UI STYLES ================= */
  const page = {
    maxWidth: 420,
    margin: "auto",
    fontFamily: "Arial",
    fontSize: 20,
    lineHeight: 1.8,
    padding: 12,
  };

  const topBar = {
    display: "flex",
    gap: 10,
    marginBottom: 12,
    flexWrap: "wrap",
  };

  const addBtn = {
    background: "green",
    color: "white",
    padding: "12px 14px",
    fontSize: 18,
    border: "none",
    borderRadius: 6,
  };

  const delBtn = {
    background: "red",
    color: "white",
    padding: "12px 14px",
    fontSize: 18,
    border: "none",
    borderRadius: 6,
  };

  const invoice = {
    border: "1px solid #ddd",
    padding: 16,
    marginBottom: 14,
    fontSize: 20,
    borderRadius: 8,
  };

  const row = {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  };

  const box = {
    width: "50%",
    fontSize: 18,
  };

  const boxRight = {
    width: "50%",
    textAlign: "right",
    fontSize: 18,
  };

  const itemHead = {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    marginTop: 12,
    fontSize: 18,
  };

  const itemRow = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  };

  const xBtn = {
    background: "black",
    color: "white",
    border: "none",
    padding: "6px 10px",
    fontSize: 16,
    borderRadius: 4,
  };

  const actions = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 10,
  };

  const mpesa = {
    flex: 1,
    background: "green",
    color: "white",
    padding: 12,
    fontSize: 18,
    border: "none",
    borderRadius: 6,
  };

  const pdf = {
    flex: 1,
    background: "blue",
    color: "white",
    padding: 12,
    fontSize: 18,
    border: "none",
    borderRadius: 6,
  };

  const bigTitle = {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  };

  return (
    <div style={page}>
      {/* TOP BUTTONS */}
      <div style={topBar}>
        <button style={addBtn} onClick={addReceipt}>
          ➕ Add Receipt
        </button>

        <button style={delBtn} onClick={deleteReceipt}>
          🗑 Delete Receipt
        </button>
      </div>

      {/* RECEIPTS */}
      {(customer.debts || []).map((r) => (
        <div id={`receipt-${r.id}`} key={r.id} style={invoice}>
          <h2 style={bigTitle}>Invoice Number: {r.invoiceNo}</h2>

          <div style={row}>
            <div style={box}>
              {user.profilePic && (
                <img
                  src={user.profilePic}
                  alt="shop"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    marginBottom: 8,
                  }}
                />
              )}

              <p><b>{user.shopName}</b></p>
              <p>{user.phone}</p>
              <p>{user.location}</p>
            </div>

            <div style={boxRight}>
              <b>CUSTOMER</b>
              <div><b>Name:</b> {customer.name}</div>
              <div><b>Phone:</b> {customer.phone}</div>
            </div>
          </div>

          <p><b>Date:</b> {r.date}</p>

          <div style={itemHead}>
            <span>Item</span>
            <span>Price</span>
            <span>Action</span>
          </div>

          {(r.items || []).map((i) => (
            <div key={i.id} style={itemRow}>
              <input
                style={{ fontSize: 18, padding: "6px 8px", width: "45%" }}
                value={i.name}
                onChange={(e) =>
                  updateItem(r.id, i.id, { name: e.target.value })
                }
              />

              <input
                style={{ fontSize: 18, padding: "6px 8px", width: "35%" }}
                type="number"
                value={i.price}
                onChange={(e) =>
                  updateItem(r.id, i.id, { price: Number(e.target.value) })
                }
              />

              <button onClick={() => deleteItem(r.id, i.id)} style={xBtn}>
                x
              </button>
            </div>
          ))}

          <button onClick={() => addItem(r.id)}>+ Add Item</button>

          <div style={{ marginTop: 10, textAlign: "right", fontSize: 22 }}>
            <b>Total: KES {getTotal(r.items)}</b>
          </div>

          <div style={actions}>
            <button style={mpesa} onClick={() => shareInvoice(r.id, "sms")}>
              SMS
            </button>

            <button style={pdf} onClick={() => shareInvoice(r.id, "whatsapp")}>
              WhatsApp
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  }



