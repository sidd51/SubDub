// ─────────────────────────────────────────────────────────────
//  Dashboard.jsx  —  Stats overview + upcoming renewals
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar   from '../components/Navbar'
import StatCard from '../components/StatCard'
import { subAPI } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user }  = useAuth()
  const [stats,    setStats]    = useState(null)
  const [upcoming, setUpcoming] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    Promise.all([subAPI.getStats(), subAPI.getUpcoming()])
      .then(([s, u]) => {
        setStats(s.data)
        setUpcoming(u.data)
      })
      .catch((e) => setError(e.message || 'Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <div className="page" style={{ paddingTop: 32 }}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={{ fontSize: 28 }}>Good day, {user?.name?.split(' ')[0]} 👋</h1>
            <p style={{ color: 'var(--text-light)', marginTop: 4, fontSize: 14 }}>Here's your subscription overview.</p>
          </div>
          <Link to="/subscriptions">
            <button className="btn-primary">+ Add Subscription</button>
          </Link>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Stat Cards */}
        {loading ? (
          <div style={styles.loadingGrid}>
            {[1,2,3,4].map(i => <div key={i} className="card" style={styles.skeleton} />)}
          </div>
        ) : stats ? (
          <div style={styles.grid}>
            <StatCard label="Active Subscriptions" value={stats.activeCount}          color="var(--sage)"     />
            <StatCard label="Monthly Spend"         value={`₹${stats.totalMonthly}`}   color="var(--rose)"     sub="across all active plans" />
            <StatCard label="Yearly Spend"          value={`₹${stats.totalYearly}`}    color="var(--sky)"      sub="projected annual cost" />
            <StatCard label="Top Category"          value={topCategory(stats.byCategory)} color="var(--lavender)" sub="by monthly spend" />
          </div>
        ) : null}

        {/* Category Breakdown */}
        {stats && Object.keys(stats.byCategory).length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={styles.sectionTitle}>Spend by Category</h2>
            <div style={styles.barList}>
              {Object.entries(stats.byCategory)
                .sort(([,a],[,b]) => b - a)
                .map(([cat, amount]) => {
                  const pct = Math.round((amount / stats.totalMonthly) * 100)
                  return (
                    <div key={cat} style={styles.barRow}>
                      <span style={styles.barLabel}>{cat}</span>
                      <div style={styles.barTrack}>
                        <div style={{ ...styles.barFill, width: `${pct}%` }} />
                      </div>
                      <span style={styles.barAmount}>₹{amount}/mo</span>
                    </div>
                  )
                })}
            </div>
          </section>
        )}

        {/* Upcoming Renewals */}
        <section style={{ marginTop: 40 }}>
          <h2 style={styles.sectionTitle}>Renewing in the next 7 days</h2>
          {upcoming.length === 0 ? (
            <p style={styles.empty}>No renewals coming up. You're clear! ✓</p>
          ) : (
            <div style={styles.upcomingList}>
              {upcoming.map((sub) => (
                <div key={sub._id} className="card" style={styles.upcomingItem}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{sub.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>
                      {new Date(sub.nextBillingDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18 }}>
                    {sub.currency} {sub.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </>
  )
}

// Helper: find the category with the most spend
function topCategory(byCategory) {
  if (!byCategory || !Object.keys(byCategory).length) return '—'
  return Object.entries(byCategory).sort(([,a],[,b]) => b - a)[0][0]
}

const styles = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 28,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
  skeleton: { height: 120, opacity: 0.4 },
  sectionTitle: { fontSize: 18, marginBottom: 16 },
  barList: { display: 'flex', flexDirection: 'column', gap: 10 },
  barRow: { display: 'flex', alignItems: 'center', gap: 14 },
  barLabel: { width: 100, fontSize: 13, color: 'var(--text-light)', textTransform: 'capitalize', flexShrink: 0 },
  barTrack: {
    flex: 1, height: 8, background: 'var(--cream-dark)',
    borderRadius: 10, overflow: 'hidden',
  },
  barFill: {
    height: '100%', background: 'var(--sage)', borderRadius: 10,
    transition: 'width 0.6s ease',
  },
  barAmount: { width: 80, textAlign: 'right', fontSize: 13, color: 'var(--text)', flexShrink: 0 },
  upcomingList: { display: 'flex', flexDirection: 'column', gap: 10 },
  upcomingItem: {
    padding: '14px 18px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderLeft: '3px solid var(--rose)',
  },
  empty: { color: 'var(--text-light)', fontSize: 14, padding: '12px 0' },
  error: {
    background: '#fce8e8', color: '#c0392b',
    padding: '12px 16px', borderRadius: 'var(--radius-sm)',
    fontSize: 13, marginBottom: 20,
  },
}
