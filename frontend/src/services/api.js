import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Keep the configured server URL at the host root; API paths are namespaced here.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
export const API_URL = `${API_BASE_URL}/api`

const api = axios.create({ baseURL: API_URL, timeout: 90000 })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) useAuthStore.getState().logout()
  return Promise.reject(error)
})

export const errorMessage = (error) => {
  const detail = error.response?.data?.detail
  if (Array.isArray(detail)) return detail.map((item) => item.msg).filter(Boolean).join('. ')
  if (typeof detail === 'string') return detail
  if (error.name === 'AbortError') return 'The request was cancelled.'
  if (error.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.'
  if (!error.response && error.message === 'Network Error') return 'Cannot reach the API. Confirm the backend is running.'
  return error.message || 'Something went wrong. Please try again.'
}
export default api
