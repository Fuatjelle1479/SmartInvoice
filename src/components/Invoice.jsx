export default function InvoiceCard({ customer, amount, dueDate, status }) {
  return (
    <div
      style={{
        background: "white",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        marginBottom: "10px"
      }}
    >
      <h3>{customer}</h3>
      <p>💰 Amount: {amount}</p>
      <p>📅 Due: {dueDate}</p>
      <p>
        Status:{" "}
        <span style={{ color: status === "overdue" ? "red" : "green" }}>
          {status}
        </span>
      </p>
    </div>
  );
}