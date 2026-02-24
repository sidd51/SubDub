// ─────────────────────────────────────────────────────────────
//  Navbar.jsx  —  Top navigation bar shown on all private pages
// ─────────────────────────────────────────────────────────────

import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()

  return (
    <nav style={styles.nav}>
      {/* Brand */}
      <Link to="/" style={styles.brand}>
        <span style={styles.dot} />
        SubDub
      </Link>

      {/* Links */}
      <div style={styles.links}>
        <Link to="/"              style={{ ...styles.link, ...(pathname === '/'              ? styles.linkActive : {}) }}>Dashboard</Link>
        <Link to="/subscriptions" style={{ ...styles.link, ...(pathname === '/subscriptions' ? styles.linkActive : {}) }}>Subscriptions</Link>
      </div>

      {/* User + Logout */}
      <div style={styles.right}>
        <span style={styles.username}>👋 {user?.name?.split(' ')[0]}</span>
        <button className="btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }} onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', gap: 32,
    padding: '14px 28px',
    background: 'var(--white)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: 'DM Serif Display, serif',
    fontSize: 20, color: 'var(--text)',
    textDecoration: 'none',
  },
  dot: {
    width: 10, height: 10,
    borderRadius: '50%',
    background: 'var(--sage-dark)',
    display: 'inline-block',
  },
  links: { display: 'flex', gap: 4, flex: 1 },
  link: {
    padding: '6px 14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14, fontWeight: 500,
    color: 'var(--text-light)',
  },
  linkActive: {
    background: 'var(--cream-dark)',
    color: 'var(--text)',
  },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  username: { fontSize: 13, color: 'var(--text-light)' },
}
