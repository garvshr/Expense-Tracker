import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Moon, Sun, Globe, CalendarDays, LogOut, Save, Check } from 'lucide-react'
import { useCurrency } from '../context/CurrencyContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const currencies = ['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)', 'JPY (¥)', 'CAD (C$)']
const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { currency: globalCurrency, setCurrency: setGlobalCurrency } = useCurrency()
  const [focused, setFocused] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })
  const [saved, setSaved] = useState(false)
  
  const [profile, setProfile] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    currency: globalCurrency,
    dateFormat: 'MM/DD/YYYY',
  })

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.fullName,
        email: user.email
      }))
    }
  }, [user])

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setGlobalCurrency(profile.currency)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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

  const inputStyle = (field) => ({
    backgroundColor: 'var(--color-bg-surface-low)',
    color: 'var(--color-text-primary)',
    border: '1px solid',
    borderColor: focused === field ? 'rgba(74, 144, 226, 0.4)' : 'transparent',
    transition: 'all 0.2s ease',
  })

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1
          className="text-2xl font-semibold"
          style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
        >
          Profile & Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Manage your account information and preferences.
        </p>
      </motion.div>

      {/* Profile Information Card */}
      <motion.div
        variants={item}
        className="rounded-xl p-6 lg:p-8"
        style={{
          backgroundColor: 'var(--color-bg-surface)'
        }}
      >
        <h2 className="text-sm font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          Profile Information
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6">
          <motion.div
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold cursor-pointer"
            style={{
              backgroundColor: 'var(--color-primary-container)',
              color: 'var(--color-primary)',
            }}
          >
            {getInitials(profile.name)}
          </motion.div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {profile.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Premium Member · Joined Jan 2024
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-5">
          <div>
            <label
              className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <User size={12} />
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={inputStyle('name')}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Mail size={12} />
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={inputStyle('email')}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
              }}
            >
              <Save size={14} />
              Update Profile
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Preferences Card */}
      <motion.div
        variants={item}
        className="rounded-xl p-6 lg:p-8"
        style={{
          backgroundColor: 'var(--color-bg-surface)'
        }}
      >
        <h2 className="text-sm font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          Preferences
        </h2>

        <div className="space-y-5">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon size={16} style={{ color: 'var(--color-primary)' }} />
              ) : (
                <Sun size={16} style={{ color: 'var(--color-text-muted)' }} />
              )}
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  Dark Mode
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Use dark theme across the application
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const newValue = !darkMode;
                setDarkMode(newValue);
                if (newValue) {
                  document.documentElement.removeAttribute('data-theme');
                  localStorage.setItem('theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                  localStorage.setItem('theme', 'light');
                }
              }}
              className="relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer"
              style={{
                backgroundColor: darkMode ? 'var(--color-primary-container)' : 'var(--color-bg-surface-highest)',
              }}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 rounded-full"
                style={{ backgroundColor: darkMode ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                animate={{ left: darkMode ? '24px' : '4px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* Currency */}
          <div>
            <label
              className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Globe size={12} />
              Currency
            </label>
            <select
              value={profile.currency}
              onChange={(e) => handleProfileChange('currency', e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm appearance-none cursor-pointer"
              style={inputStyle('currency')}
              onFocus={() => setFocused('currency')}
              onBlur={() => setFocused(null)}
            >
              {currencies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Date Format */}
          <div>
            <label
              className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <CalendarDays size={12} />
              Date Format
            </label>
            <select
              value={profile.dateFormat}
              onChange={(e) => handleProfileChange('dateFormat', e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm appearance-none cursor-pointer"
              style={inputStyle('dateFormat')}
              onFocus={() => setFocused('dateFormat')}
              onBlur={() => setFocused(null)}
            >
              {dateFormats.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
              }}
            >
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saved ? 'Saved!' : 'Save Preferences'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div variants={item} className="flex justify-center pb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: 'transparent',
            color: 'var(--color-error)',
            border: '1px solid transparent',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 180, 171, 0.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <LogOut size={14} />
          Log Out
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
