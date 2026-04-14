import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.js'
import Dashboard from './pages/Dashboard.js'
import Expenses from './pages/Expenses.js'
import AddExpense from './pages/AddExpense.js'
import Analytics from './pages/Analytics.js'
import Profile from './pages/Profile.js'
import AppLayout from './components/AppLayout.js'
import ProtectedRoute from './components/ProtectedRoute.js'
import { CurrencyProvider } from './context/CurrencyContext.js'
import { AuthProvider } from './context/AuthContext.js'

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
