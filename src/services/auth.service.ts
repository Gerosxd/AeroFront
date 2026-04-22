import http from '../api/http'

export type SessionUser = {
  token: string
  idUsuario: number
  username: string
  nombre: string
  correo: string
  rol: number
}

export async function login(username: string, password: string) {
  const { data } = await http.post<SessionUser>('/api/auth/login', {
    username,
    password,
  })
  return data
}

export function saveSession(session: SessionUser) {
  localStorage.setItem('token', session.token)
  localStorage.setItem('sessionUser', JSON.stringify(session))
}

export function getToken() {
  return localStorage.getItem('token')
}

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem('sessionUser')
  if (!raw) return null

  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return !!getToken()
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('sessionUser')
}