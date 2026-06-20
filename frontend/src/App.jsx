import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ToastContainer from './components/ToastContainer'
import ErrorBoundary from './components/ErrorBoundary'
import { useTheme } from './hooks/useTheme'
import AppLayout from './layouts/AppLayout'
import AnalyticsPage from './pages/AnalyticsPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import GeneratorPage from './pages/GeneratorPage'
import LandingPage from './pages/LandingPage'
import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'
import WorkspacePage from './pages/WorkspacePage'
import TeamPage from './pages/TeamPage'
import CalendarPage from './pages/CalendarPage'
import TemplatesPage from './pages/TemplatesPage'
import AdminPage from './pages/AdminPage'
import SettingsPage from './pages/SettingsPage'

export default function App(){
  useTheme()
  return <ErrorBoundary><ToastContainer/><Routes><Route path="/" element={<LandingPage/>}/><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/register" element={<AuthPage mode="register"/>}/><Route element={<ProtectedRoute/>}><Route path="/app" element={<AppLayout/>}><Route index element={<DashboardPage/>}/><Route path="workspace" element={<WorkspacePage/>}/><Route path="create" element={<GeneratorPage/>}/><Route path="library" element={<LibraryPage/>}/><Route path="calendar" element={<CalendarPage/>}/><Route path="analytics" element={<AnalyticsPage/>}/><Route path="templates" element={<TemplatesPage/>}/><Route path="team" element={<TeamPage/>}/><Route path="admin" element={<AdminPage/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="profile" element={<ProfilePage/>}/></Route></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes></ErrorBoundary>
}
