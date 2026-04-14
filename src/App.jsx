import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Expenses from './pages/Expenses.jsx'
import AddExpense from './pages/AddExpense.jsx'
import Analytics from './pages/Analytics.jsx'
import Profile from './pages/Profile.jsx'
import AppLayout from './components/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  return (
    <AuthProvider>
      <CurrencyProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="add-expense" element={<AddExpense />} />
              <Route path="edit/:id" element={<AddExpense />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default App
