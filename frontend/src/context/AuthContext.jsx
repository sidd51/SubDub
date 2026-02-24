// ─────────────────────────────────────────────────────────────
//  AuthContext.jsx
//  Provides { user, token, login, logout } to the whole app.
//  Any component can call useAuth() to access these.
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, userAPI } from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [loading, setLoading] = useState(true) // checking token on mount

  // On first load, if a token exists, fetch the current user
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }

    userAPI.getMe()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    localStorage.setItem('token', res.token)
    setUser(res.user)
    return res
  }

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password })
    localStorage.setItem('token', res.token)
    setUser(res.user)
    return res
  }

  const logout = async () => {
    await authAPI.logout().catch(() => {}) // silent fail is fine
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — components do: const { user, logout } = useAuth()
export const useAuth = () => useContext(AuthContext)
