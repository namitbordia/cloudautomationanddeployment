function MetricCard({ label, value, tone = "default" }) {
  return (
    <article className={`metricCard ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export default MetricCard;
