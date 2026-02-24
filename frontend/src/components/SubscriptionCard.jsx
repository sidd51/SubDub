// ─────────────────────────────────────────────────────────────
//  SubscriptionCard.jsx
// ─────────────────────────────────────────────────────────────
import { Trash2, Pencil } from 'lucide-react'
import { useState } from 'react'

const CATEGORY_COLORS = {
  streaming:   '#e8b4b8',
  productivity:'#b8d4e8',
  gaming:      '#c5b8e8',
  news:        '#f0d9a8',
  fitness:     '#a8c5a0',
  cloud:       '#b8d8e8',
  software:    '#d4c5e8',
  education:   '#e8d4b8',
  other:       '#d8d0c8',
}

const STATUS_COLORS = {
  active:    { bg: '#edf7ed', color: '#2e7d32' },
  paused:    { bg: '#fff8e1', color: '#f57f17' },
  cancelled: { bg: '#fce8e8', color: '#c0392b' },
  expired:   { bg: '#f3f3f3', color: '#616161' }, // ✅ added
}

export default function SubscriptionCard({
  sub,
  onEdit,
  onDelete,

  //NEW ACTION HANDLERS
  onRenew,
  onPause,
  onResume,
  onCancel,
  onChangePlan,
}) {
  const [hovered, setHovered] = useState(false)

  const catColor = CATEGORY_COLORS[sub.category] || CATEGORY_COLORS.other

  //Use computedStatus if available
  const status = sub.computedStatus || sub.status
  const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.active

  const nextBilling = sub.nextBillingDate
    ? new Date(sub.nextBillingDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—'

  return (
    <div className="card fade-up" style={{
    ...styles.card,
    transform: hovered
      ? 'translateY(-6px) scale(1.015)'
      : 'translateY(0) scale(1)',
    boxShadow: hovered
      ? '0 14px 30px rgba(0,0,0,0.12)'
      : '0 2px 6px rgba(0,0,0,0.05)',
  }}onMouseEnter={() => setHovered(true)}
     onMouseLeave={() => setHovered(false)}>
      <div style={{ ...styles.strip, background: catColor }} />

      <div style={styles.body}>
        {/* Top row */}
        <div style={styles.topRow}>
          <div>
            <div style={styles.name}>{sub.name}</div>
            <div style={styles.category}>{sub.category}</div>
          </div>
          <div style={styles.price}>
            <span style={styles.amount}>
              {sub.currency} {sub.price}
            </span>
            <span style={styles.freq}>/ {sub.frequency}</span>
          </div>
        </div>
          {hovered && sub.notes && (
            <div style={styles.notes}>
             {sub.notes}
            </div>
          )}

        {/* Bottom row */}
        <div style={styles.bottomRow}>
          <span style={{ ...styles.status, ...statusStyle }}>{status}</span>
          <span style={styles.billing}>Renews {nextBilling}</span>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          

          {/*Dynamic Actions */}
          {status === 'active' && (
            <>
               <button className="btn-ghost"  style={styles.smallBtn} onClick={() => onChangePlan(sub)}>
                Change Plan
              </button>
              <button className="btn-ghost" style={styles.smallBtn} onClick={() => onPause(sub._id)}>
                Pause
              </button>
             
              <button className="btn-danger" onClick={() => onCancel(sub._id)}>
                Cancel
              </button>
            </>
          )}

          {status === 'paused' && (
            <button className="btn-ghost" style={styles.smallBtn}  onClick={() => onResume(sub._id)}>
              Resume
            </button>
          )}

          {status === 'expired' && (
            <button className="btn-ghost" style={styles.smallBtn}  onClick={() => onRenew(sub._id)}>
              Renew
            </button>
          )}

          {hovered && (
          <div style={styles.topIcons}>
            <div
              style={styles.iconBtn}
              onClick={() => onEdit(sub)}
              title="Edit"
            >
              <Pencil size={16} />
            </div>

            <div
              style={{ ...styles.iconBtn, color: '#c0392b' }}
              onClick={() => onDelete(sub._id)}
              title="Delete"
            >
              <Trash2 size={16} />
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  smallBtn: {
  padding: '4px 10px',        
  fontSize: 12,               
  borderRadius: 10,
   
},
notes: {
  fontSize: 12,
  color: 'var(--text-light)',
  marginTop: 4,
},

topIcons: {
  position: 'absolute',
  top: 10,
  right: 10,
  display: 'flex',
  gap: 8,
},

iconBtn: {
  cursor: 'pointer',
  color: 'var(--text-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.15s ease, opacity 0.15s ease',
},
  card: { padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative',transition: 'all 0.25s ease', transform: 'translateY(0) scale(1)',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',  },
  strip: { height: 5, width: '100%' },
  body: { padding: '28px 20px 18px', display: 'flex', flexDirection: 'column', gap: 12 },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontWeight: 600, fontSize: 15, color: 'var(--text)' },
  category: { fontSize: 12, color: 'var(--text-light)', textTransform: 'capitalize', marginTop: 2 },
  price: { textAlign: 'right' },
  amount: { fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'var(--text)' },
  freq: { fontSize: 12, color: 'var(--text-light)', marginLeft: 2 },
  bottomRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  status: { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' },
  billing: { fontSize: 12, color: 'var(--text-light)' },
  actions: { display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 8, flexWrap: 'wrap' }, // slight wrap support
}