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
    setCustomer(data.find((c) => String(c.id) === String(id)) || null);
  }, [user?.email, id]);

  const save = (updated) => {
    const key = `customers_${user.profile?.email}`;
    localStorage.setItem(key, JSON.stringify(updated));

    setCustomers(updated);
    setCustomer(updated.find((c) => c.id === id));
  };

  if (!user) return <h3>Login required</h3>;
if (!customers.length) return <h3>Loading...</h3>;
if (!customer) return <h3>Customer not found</h3>;

  /* ➕ ADD RECEIPT */
  const generateInvoiceNo = (invoice) => {
    const count = invoice?.length || 0;
    return `#${String(count + 1).padStart(3, "0")}`;
  };

  const addReceipt = () => {
    const currentInvoice =
      customers.find((c) => c.id === id)?.invoice || [];

    const newReceipt = {
      id: crypto.randomUUID(),
      invoiceNo: generateInvoiceNo(currentInvoice),
      date: new Date().toISOString().split("T")[0],
      items: [],
    };

    const updated = customers.map((c) =>
      c.id === id
        ? { ...c, invoice: [...(c.invoice || []), newReceipt] }
        : c
    );

    save(updated);
  };

  const deleteReceipt = () => {
    const updated = customers.map((c) =>
      c.id === id
        ? { ...c, invoice: (c.invoice || []).slice(0, -1) }
        : c
    );

    save(updated);
  };

  const addItem = (rid) => {
    const updated = customers.map((c) =>
      c.id === id
        ? {
            ...c,
            invoice: c.invoice.map((r) =>
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
            invoice: c.invoice.map((r) =>
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
            invoice: c.invoice.map((r) =>
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

    // BEST OPTION: native share (attaches image)
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

    // fallback: opens WhatsApp search/chat (NO image attach possible)
    const fallbackUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(fallbackUrl, "_blank");
  }

  // ================= SMS =================
  if (method === "sms") {
  const receipt = customer?.invoice?.find((r) => r.id === receiptId);

  const itemsText = (receipt?.items || [])
    .map((i, index) => {
      return `${index + 1}. ${i.name} - KES ${i.price}`;
    })
    .join("\n");

  const total = getTotal(receipt?.items || []);

  const message = `
INVOICE RECEIPT
-----------------------
SHOP DETAILS
Name: ${user.shopName || "N/A"}
Phone: ${user.phone || "N/A"}
Payment: ${user.paymentDetails || "N/A"}

-----------------------
CUSTOMER DETAILS
Name: ${customer.name}
Phone: ${customer.phone}

-----------------------
ITEMS
${itemsText || "No items added"}

-----------------------
TOTAL: KES ${total}

Thank you for your business!
`;

  const phone = (customer.phone || "")
    .replace(/\s+/g, "")
    .replace("+", "");

  const encoded = encodeURIComponent(message);

  const smsUrl = /iPhone|iPad|iPod/.test(navigator.userAgent)
    ? `sms:${phone}&body=${encoded}`
    : `sms:${phone}?body=${encoded}`;

  window.location.href = smsUrl;
}
};
  /* ================= UI STYLES ================= */
  /* PAGE */
/* ================= PAGE ================= */
const page = {
  width: "100%",
  maxWidth: 600,
  margin: "0 auto",
  padding: "10px 12px",
  fontFamily: "Arial",
  fontSize: 15,
  lineHeight: 1.5,
  boxSizing: "border-box",
};

/* ================= TOP BAR ================= */
const topBar = {
  position: "sticky",
  top: 0,
  background: "#f8fafc",
  zIndex: 10,
  display: "flex",
  gap: 8,
  paddingBottom: 10,
};

const addBtn = {
  flex: 1,
  background: "#16a34a",
  color: "white",
  padding: 12,
  fontSize: 15,
  border: "none",
  borderRadius: 8,
};

const delBtn = {
  flex: 1,
  background: "#dc2626",
  color: "white",
  padding: 12,
  fontSize: 15,
  border: "none",
  borderRadius: 8,
};

/* ================= INVOICE CARD ================= */
const invoice = {
  border: "1px solid #eee",
  padding: 12,
  marginBottom: 14,
  borderRadius: 12,
  background: "white",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

/* ================= HEADER ROW ================= */
const row = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const box = {
  flex: 1,
  minWidth: "45%",
};

const boxRight = {
  flex: 1,
  minWidth: "45%",
  textAlign: "right",
};

/* ================= TITLE ================= */
const bigTitle = {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 6,
};

/* ================= ITEM TABLE HEADER ================= */
const itemHead = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 10,
  fontWeight: "bold",
  fontSize: 14,
  padding: "6px 0",
  borderBottom: "1px solid #ddd",
};

const colItem = { width: "40%" };
const colPrice = { width: "30%", textAlign: "center" };
const colAction = { width: "20%", textAlign: "right" };

/* ================= ITEM ROW ================= */
const itemRow = {
  display: "flex",
  gap: 6,
  alignItems: "center",
  marginTop: 8,
};

const itemInput = {
  width: "40%",
  padding: 8,
  fontSize: 14,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const priceInput = {
  width: "30%",
  padding: 8,
  fontSize: 14,
  borderRadius: 6,
  border: "1px solid #ccc",
  textAlign: "center",
};

const deleteBtn = {
  width: "20%",
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: 8,
  borderRadius: 6,
};

/* ================= ACTIONS ================= */
const actions = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  marginTop: 12,
};

const mpesa = {
  width: "100%",
  background: "#16a34a",
  color: "white",
  padding: 14,
  fontSize: 15,
  borderRadius: 8,
  border: "none",
};

const pdf = {
  width: "100%",
  background: "#2563eb",
  color: "white",
  padding: 14,
  fontSize: 15,
  borderRadius: 8,
  border: "none",
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
    {(customer.invoice || []).map((r) => (
      <div id={`receipt-${r.id}`} key={r.id} style={invoice}>
        <h2 style={bigTitle}>Invoice Number: {r.invoiceNo}</h2>

        {/* SHOP + CUSTOMER INFO */}
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

{/* 🔥 PAYMENT DETAILS */}
{user.payment?.type && (
  <div style={{ marginTop: 10 }}>
    <p><b>Payment Method:</b> {user.payment.type}</p>

    {user.payment.type === "agent" && (
      <>
        <p>Agent No: {user.payment.agentNumber}</p>
        <p>Store No: {user.payment.storeNumber}</p>
      </>
    )}

    {user.payment.type === "till" && (
      <p>Till No: {user.payment.tillNumber}</p>
    )}

    {user.payment.type === "pochi" && (
      <p>Pochi No: {user.payment.pochiNumber}</p>
    )}

    {user.payment.type === "sendmoney" && (
      <p>Send Money No: {user.payment.sendMoneyNumber}</p>
    )}

    {user.payment.type === "paybill" && (
      <>
        <p>PayBill No: {user.payment.paybillNumber}</p>
        <p>Account No: {user.payment.accountNumber}</p>
      </>
    )}
  </div>
)}
</div>
          <div style={boxRight}>
            <b>CUSTOMER</b>
            <div><b>Name:</b> {customer.name}</div>
            <div><b>Phone:</b> {customer.phone}</div>
          </div>
        </div>

        <p><b>Date:</b> {r.date}</p>

        {/* TABLE HEADER */}
        <div style={itemHead}>
          <span style={colItem}>Item</span>
          <span style={colPrice}>Price</span>
          <span style={colAction}>Action</span>
        </div>

        {/* ITEMS */}
        {(r.items || []).map((i) => (
          <div key={i.id} style={itemRow}>
            <input
              style={itemInput}
              value={i.name}
              onChange={(e) =>
                updateItem(r.id, i.id, { name: e.target.value })
              }
            />

            <input
              type="number"
              style={priceInput}
              value={i.price}
              onChange={(e) =>
                updateItem(r.id, i.id, { price: Number(e.target.value) })
              }
            />

            <button
              onClick={() => deleteItem(r.id, i.id)}
              style={deleteBtn}
            >
              ✕
            </button>
          </div>
        ))}

        {/* ADD ITEM */}
        <button onClick={() => addItem(r.id)}>+ Add Item</button>

        {/* TOTAL */}
        <div style={{ marginTop: 10, textAlign: "right", fontSize: 22 }}>
          <b>Total: KES {getTotal(r.items)}</b>
        </div>

        {/* ACTIONS */}
        <div style={actions}>
          <button
            style={mpesa}
            onClick={() => shareInvoice(r.id, "sms")}
          >
            SMS
          </button>

          <button
            style={pdf}
            onClick={() => shareInvoice(r.id, "whatsapp")}
          >
            WhatsApp
          </button>
        </div>
      </div>
    ))}

  </div>
  );
}