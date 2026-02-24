// ─────────────────────────────────────────────────────────────
//  api.js — centralized API layer
// ─────────────────────────────────────────────────────────────

const BASE = '/api/v1'

// Attach JWT
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
})

//Handle responses
const json = async (res) => {
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  register: (data) =>
    fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(json),

  login: (data) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(json),

  logout: () =>
    fetch(`${BASE}/auth/logout`, {
      method: 'POST',
      headers: authHeaders(),
    }).then(json),
}

// ── Users ─────────────────────────────────────────────────────
export const userAPI = {
  getMe: () =>
    fetch(`${BASE}/users/me`, {
      headers: authHeaders(),
    }).then(json),
}

// ── Subscriptions ─────────────────────────────────────────────
export const subAPI = {
  //Get all
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    return fetch(`${BASE}/subscriptions${params ? `?${params}` : ''}`, {
      headers: authHeaders(),
    }).then(json)
  },

  //Get one
  getOne: (id) =>
    fetch(`${BASE}/subscriptions/${id}`, {
      headers: authHeaders(),
    }).then(json),

  // Create
  create: (data) =>
    fetch(`${BASE}/subscriptions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(json),

  //Safe update (name, notes, etc.)
  update: (id, data) =>
    fetch(`${BASE}/subscriptions/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(json),

  // Delete
  delete: (id) =>
    fetch(`${BASE}/subscriptions/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(json),

  // Stats
  getStats: () =>
    fetch(`${BASE}/subscriptions/stats`, {
      headers: authHeaders(),
    }).then(json),

  // Upcoming
  getUpcoming: () =>
    fetch(`${BASE}/subscriptions/upcoming`, {
      headers: authHeaders(),
    }).then(json),

  // ── NEW ACTION ENDPOINTS ─────────────────────────────

  //Renew subscription
  renew: (id) =>
    fetch(`${BASE}/subscriptions/${id}/renew`, {
      method: 'POST',
      headers: authHeaders(),
    }).then(json),

  //Cancel subscription
  cancel: (id) =>
    fetch(`${BASE}/subscriptions/${id}/cancel`, {
      method: 'POST',
      headers: authHeaders(),
    }).then(json),

  //Pause subscription
  pause: (id) =>
    fetch(`${BASE}/subscriptions/${id}/pause`, {
      method: 'POST',
      headers: authHeaders(),
    }).then(json),

  //Resume subscription
  resume: (id) =>
    fetch(`${BASE}/subscriptions/${id}/resume`, {
      method: 'POST',
      headers: authHeaders(),
    }).then(json),

  //Change plan (frequency)
  changePlan: (id, frequency) =>
    fetch(`${BASE}/subscriptions/${id}/change-plan`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ frequency }),
    }).then(json),
}