export default function StatsCard({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        width: "200px"
      }}
    >
      <h4 style={{ color: "#555" }}>{title}</h4>
      <h2 style={{ marginTop: "10px" }}>{value}</h2>
    </div>
  );
}