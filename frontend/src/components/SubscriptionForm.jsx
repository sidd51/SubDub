import { useState } from 'react'

const EMPTY = {
  name: '',
  price: '',
  currency: 'USD',
  frequency: 'monthly',
  category: 'other',
  startDate: new Date().toISOString().split('T')[0],
  notes: '',
}

export default function SubscriptionForm({
  initial,
  onSubmit,
  onCancel,
  mode = 'create', 
}) {
  const [form, setForm] = useState(
    initial
      ? {
          ...initial,
          startDate:
            initial.startDate?.split('T')[0] || EMPTY.startDate,
        }
      : EMPTY
  )

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEdit = mode === 'edit'
  const isPlan = mode === 'plan'

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({
        ...form,
        price: parseFloat(form.price),
      })
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <div style={styles.error}>{error}</div>}

      {/*CHANGE PLAN MODE (ONLY FREQUENCY & PRICE) */}
      {isPlan ? (
        <div className="field">
          <label>Frequency</label>
          <select value={form.frequency} onChange={set('frequency')} >
            {['daily', 'weekly', 'monthly', 'yearly'].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      ) : (
        <>
          {/* NAME */}
          <div className="field">
            <label>Name</label>
            <input
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Netflix"
              required
            />
          </div>

          {/* PRICE + CURRENCY */}
          <div style={styles.row}>
            <div className="field" style={{ flex: 1 }}>
              <label>Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={set('price')}
                disabled={isEdit} // 🔒 lock in edit
                placeholder="9.99"
                required
              />
            </div>

            <div className="field" style={{ flex: 1 }}>
              <label>Currency</label>
              <select
                value={form.currency}
                onChange={set('currency')}
                disabled={isEdit} // 🔒 lock in edit
              >
                {['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* FREQUENCY + CATEGORY */}
          <div style={styles.row}>
            <div className="field" style={{ flex: 1 }}>
              <label>Frequency</label>
              <select value={form.frequency} onChange={set('frequency')} disabled={isEdit} >
                {['daily', 'weekly', 'monthly', 'yearly'].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="field" style={{ flex: 1 }}>
              <label>Category</label>
              <select
                value={form.category}
                onChange={set('category')}
              >
                {[
                  'streaming',
                  'productivity',
                  'gaming',
                  'news',
                  'fitness',
                  'cloud',
                  'software',
                  'education',
                  'other',
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* START DATE */}
          <div className="field">
            <label>Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={set('startDate')}
              disabled={isEdit} // 🔒 lock in edit
              required
            />
          </div>

          {/* NOTES */}
          <div className="field">
            <label>
              Notes{' '}
              <span
                style={{
                  color: 'var(--text-light)',
                  fontWeight: 400,
                }}
              >
                (optional)
              </span>
            </label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={set('notes')}
              placeholder="Any notes…"
              style={{ resize: 'vertical' }}
            />
          </div>
        </>
      )}

      {/* ACTIONS */}
      <div style={styles.actions}>
        <button
          type="button"
          className="btn-ghost"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading
            ? 'Saving…'
            : mode === 'plan'
            ? 'Change Plan'
            : initial
            ? 'Save Changes'
            : 'Add Subscription'}
        </button>
      </div>
    </form>
  )
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  row: {
    display: 'flex',
    gap: 12,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  error: {
    background: '#fce8e8',
    color: '#c0392b',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
  },
}