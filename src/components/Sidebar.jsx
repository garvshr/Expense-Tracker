import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  PlusCircle,
  User,
  LogOut,
  Wallet,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/add-expense', label: 'Add Expense', icon: PlusCircle },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getInitials = (name) => {
    if (!name) return '??'
    const parts = name.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 pt-8 pb-2">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center animate-float"
            style={{ backgroundColor: 'var(--color-primary-container)' }}
          >
            <Wallet size={18} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h1 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              CashCompass
            </h1>
            <p className="text-[0.6875rem] tracking-wider uppercase" style={{ color: 'var(--color-text-muted)' }}>
              Financial Navigator
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-3 flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? 'var(--color-bg-surface-high)' : 'transparent',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)'
                      e.currentTarget.style.color = 'var(--color-text-secondary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--color-text-muted)'
                    }
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="px-4 pb-6">
        <div
          className="rounded-lg p-3 flex items-center gap-3"
          style={{ backgroundColor: 'var(--color-bg-surface)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{
              backgroundColor: 'var(--color-primary-container)',
              color: 'var(--color-primary)',
            }}
          >
            {getInitials(user?.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
              {user?.fullName || 'Guest User'}
            </p>
            <p className="text-[0.6875rem]" style={{ color: 'var(--color-text-muted)' }}>
              Premium Member
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md transition-colors duration-200 hover:opacity-80"
            style={{ color: 'var(--color-text-muted)' }}
            title="Log out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden"
        style={{ backgroundColor: 'var(--color-bg-surface-high)', color: 'var(--color-text-primary)' }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col sticky left-0 top-0 h-screen w-60 z-40 shrink-0"
        style={{
          backgroundColor: 'var(--color-bg-surface-lowest)'
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden flex flex-col fixed left-0 top-0 bottom-0 w-[260px] z-40 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--color-bg-surface-lowest)'
        }}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
