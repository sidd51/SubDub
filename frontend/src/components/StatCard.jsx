// ─────────────────────────────────────────────────────────────
//  StatCard.jsx  —  Single metric card on the dashboard
// ─────────────────────────────────────────────────────────────

export default function StatCard({ label, value, sub, color = 'var(--sage)' }) {
  return (
    <div className="card fade-up" style={styles.card}>
      <div style={{ ...styles.dot, background: color }} />
      <div style={styles.value}>{value}</div>
      <div style={styles.label}>{label}</div>
      {sub && <div style={styles.sub}>{sub}</div>}
    </div>
  )
}

const styles = {
  card: {
    padding: '24px 28px',
    display: 'flex', flexDirection: 'column', gap: 4,
    position: 'relative', overflow: 'hidden',
  },
  dot: {
    width: 36, height: 36, borderRadius: '50%',
    marginBottom: 12, opacity: 0.7,
  },
  value: {
    fontFamily: 'DM Serif Display, serif',
    fontSize: 32, color: 'var(--text)',
    lineHeight: 1,
  },
  label: { fontSize: 13, color: 'var(--text-light)', fontWeight: 500, marginTop: 4 },
  sub:   { fontSize: 12, color: 'var(--text-light)', marginTop: 2 },
}
