// ─────────────────────────────────────────────────────────────
//  Modal.jsx  —  Reusable overlay dialog.
//  Usage: <Modal title="Add Sub" onClose={fn}> ...content </Modal>
// ─────────────────────────────────────────────────────────────

import { useEffect } from 'react'

export default function Modal({ title, onClose, children }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        className="card fade-up"
        style={styles.modal}
        onClick={(e) => e.stopPropagation()} // don't close when clicking inside
      >
        <div style={styles.header}>
          <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20 }}>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(58,53,48,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200, padding: 20,
    backdropFilter: 'blur(2px)',
  },
  modal: {
    width: '100%', maxWidth: 480,
    maxHeight: '90vh', overflowY: 'auto',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px 0',
  },
  body: { padding: '16px 24px 24px' },
  closeBtn: {
    background: 'none', border: 'none',
    fontSize: 16, color: 'var(--text-light)',
    cursor: 'pointer', padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    transition: 'background 0.15s',
  },
}
