// ─────────────────────────────────────────────────────────────
//  Login.jsx  —  Public page: email + password → get JWT
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <span style={styles.dot} />
          SubDub
        </div>
        <h1 style={styles.headline}>Track every<br /><em>subscription</em><br />you own.</h1>
        <p style={styles.tagline}>Know exactly what you're paying for — monthly, yearly, all in one place.</p>
      </div>

      <div style={styles.right}>
        <div className="card fade-up" style={styles.card}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, marginBottom: 6 }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 24 }}>
            No account? <Link to="/register" style={styles.link}>Register here</Link>
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: 8, width: '100%', padding: '12px' }} disabled={loading}>
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
            <button
        type="button"
        className="btn-ghost"
        style={{ marginTop: 10, width: '100%' }}
        onClick={async () => {
          setLoading(true)
          try {
            await login('siddhi@contact.com', '123123')
            navigate('/')
          } finally {
            setLoading(false)
          }
        }}
      >
        Try Demo Account
      </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex',
    background: 'var(--cream)',
  },
  left: {
    flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: '60px 80px',
    background: 'linear-gradient(160deg, #e8f5e4 0%, #f0e8d8 100%)',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: 'DM Serif Display, serif', fontSize: 22,
    marginBottom: 48,
  },
  dot: { width: 12, height: 12, borderRadius: '50%', background: 'var(--sage-dark)', display: 'inline-block' },
  headline: {
    fontFamily: 'DM Serif Display, serif',
    fontSize: 52, lineHeight: 1.1,
    color: 'var(--text)', marginBottom: 20,
  },
  tagline: { fontSize: 15, color: 'var(--text-light)', maxWidth: 300, lineHeight: 1.7 },
  right: { width: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 },
  card: { padding: 32, width: '100%' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  link: { color: 'var(--sage-dark)', fontWeight: 500 },
  error: {
    background: '#fce8e8', color: '#c0392b',
    padding: '10px 14px', borderRadius: 'var(--radius-sm)',
    fontSize: 13, marginBottom: 12,
  },
}
