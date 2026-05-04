export default function CustomerCard({ name, phone, balance }) {
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
      <h3>{name}</h3>
      <p>📞 {phone}</p>
      <p>💰 Balance: {balance}</p>
    </div>
  );
}