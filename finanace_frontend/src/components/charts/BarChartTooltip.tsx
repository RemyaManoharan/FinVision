interface BarChartTooltipProps {
  id: string;
  value: number;
  color: string;
  currency: string;
}

const BarChartTooltip: React.FC<BarChartTooltipProps> = ({
  id,
  value,
  color,
  currency,
}) => (
  <div
    style={{
      background: "rgb(var(--color-card))",
      padding: "12px 16px",
      border: "1px solid rgb(var(--color-border))",
      borderRadius: "6px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: color,
          borderRadius: "2px",
        }}
      />
      <strong style={{ color: "rgb(var(--color-text))" }}>{id}</strong>
    </div>
    <div style={{ marginTop: "4px", color: "rgb(var(--color-muted))" }}>
      {currency} {value.toLocaleString()}
    </div>
  </div>
);

export default BarChartTooltip;
