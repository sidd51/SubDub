import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SubscriptionCard from '../components/SubscriptionCard'
import Modal from '../components/Modal'
import SubscriptionForm from '../components/SubscriptionForm'
import { subAPI } from '../api/api'

export default function Subscriptions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  //  NEW MODAL STRUCTURE
  const [modal, setModal] = useState(null)

  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const load = () => {
    setLoading(true)
    const filters = {}
    if (filterStatus) filters.status = filterStatus
    if (filterCategory) filters.category = filterCategory

    subAPI.getAll(filters)
      .then((res) => setSubs(res.data))
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filterStatus, filterCategory])

  // ─── ACTIONS ─────────────────────────────────

  const handleRenew = async (id) => {
    try {
      await subAPI.renew(id)
      load()
    } catch (e) {
      alert(e.message || 'Renew failed')
    }
  }

  const handlePause = async (id) => {
    try {
      await subAPI.pause(id)
      load()
    } catch (e) {
      alert(e.message || 'Pause failed')
    }
  }

  const handleResume = async (id) => {
    try {
      await subAPI.resume(id)
      load()
    } catch (e) {
      alert(e.message || 'Resume failed')
    }
  }

  const handleCancel = async (id) => {
    try {
      await subAPI.cancel(id)
      load()
    } catch (e) {
      alert(e.message || 'Cancel failed')
    }
  }

  //  OPEN CHANGE PLAN FORM (NO PROMPT)
  const handleChangePlan = (sub) => {
    setModal({ type: 'plan', data: sub })
  }

  const handleEditClick = (sub) => {
    setModal({ type: 'edit', data: sub })
  }

  // ─── FORM SUBMITS ────────────────────────────

  const handleCreate = async (data) => {
    await subAPI.create(data)
    setModal(null)
    load()
  }

  const handleEdit = async (data) => {
    await subAPI.update(modal.data._id, data)
    setModal(null)
    load()
  }

  const handlePlanSubmit = async (data) => {
    await subAPI.changePlan(modal.data._id, data.frequency)
    setModal(null)
    load()
  }

  const handleDelete = async (id) => {
    await subAPI.delete(id)
    load()
  }

  return (
    <>
      <Navbar />
      <div className="page" style={{ paddingTop: 32 }}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={{ fontSize: 28 }}>Subscriptions</h1>
            <p style={{ color: 'var(--text-light)', marginTop: 4, fontSize: 14 }}>
              {subs.length} subscription{subs.length !== 1 ? 's' : ''} found
            </p>
          </div>

         
          <button className="btn-primary" onClick={() => setModal({ type: 'add' })}>
            + Add New
          </button>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <select
            style={styles.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {['active','paused','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            style={styles.select}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {['streaming','productivity','gaming','news','fitness','cloud','software','education','other'].map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>

          {(filterStatus || filterCategory) && (
            <button
              className="btn-ghost"
              style={{ fontSize: 13, padding: '8px 14px' }}
              onClick={() => { setFilterStatus(''); setFilterCategory('') }}
            >
              Clear filters
            </button>
          )}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Grid */}
        {loading ? (
          <div style={styles.grid}>
            {[1,2,3,4,5,6].map(i => <div key={i} className="card" style={styles.skeleton} />)}
          </div>
        ) : subs.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3>No subscriptions yet</h3>
            <button className="btn-primary" onClick={() => setModal({ type: 'add' })}>
              + Add Subscription
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {subs.map((sub) => (
              <SubscriptionCard
                key={sub._id}
                sub={sub}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onRenew={handleRenew}
                onPause={handlePause}
                onResume={handleResume}
                onCancel={handleCancel}
                onChangePlan={handleChangePlan}
              />
            ))}
          </div>
        )}

      </div>

      {/*  SINGLE MODAL SYSTEM */}
      {modal && (
        <Modal
          title={
            modal.type === 'add'
              ? 'Add Subscription'
              : modal.type === 'edit'
              ? 'Edit Subscription'
              : 'Change Plan'
          }
          onClose={() => setModal(null)}
        >
          <SubscriptionForm
            initial={modal.data}
            mode={modal.type}
            onSubmit={
              modal.type === 'add'
                ? handleCreate
                : modal.type === 'edit'
                ? handleEdit
                : handlePlanSubmit
            }
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </>
  )
}
const styles = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 20,
  },
  filters: {
    display: 'flex', gap: 10, alignItems: 'center',
    marginBottom: 24,
  },
  select: {
    padding: '9px 14px',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13, background: 'var(--white)',
    color: 'var(--text)', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
    alignItems: 'start'
  },
  skeleton: { height: 160, opacity: 0.4 },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '80px 20px', textAlign: 'center',
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  error: {
    background: '#fce8e8', color: '#c0392b',
    padding: '12px 16px', borderRadius: 'var(--radius-sm)',
    fontSize: 13, marginBottom: 20,
  },
}
