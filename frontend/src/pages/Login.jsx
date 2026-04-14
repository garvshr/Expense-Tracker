import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, register, error: authError } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [localError, setLocalError] = useState('')
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  
  const [focused, setFocused] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLocalError('')
    setSuccess('')

    try {
      if (isSignup) {
        if (!formData.fullName) throw new Error('Full Name is required')
        await register(formData.fullName, formData.email, formData.password)
        setSuccess('Account created successfully! Redirecting...')
      } else {
        await login(formData.email, formData.password)
        setSuccess('Logged in successfully! Redirecting...')
      }
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      setLocalError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignup(!isSignup)
    setLocalError('')
    setSuccess('')
    setFormData({ fullName: '', email: '', password: '' })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative"
      style={{ backgroundColor: '#0c0e12' }}
    >
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.05]"
          style={{ backgroundColor: '#a78bfa' }}
        />
        <div 
          className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.03]"
          style={{ backgroundColor: '#818cf8' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div
          className="rounded-[28px] p-10 border border-[#1e2024]"
          style={{
            backgroundColor: '#111317',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(167, 139, 250, 0.1)' }}
            >
              <Wallet size={32} style={{ color: '#a78bfa' }} />
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              {isSignup ? 'Create account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              {isSignup ? 'Start your financial journey today' : 'Log in to manage your finances'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {isSignup && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    onFocus={() => setFocused('fullName')}
                    onBlur={() => setFocused(null)}
                    className="w-full px-5 py-4 bg-[#1a1c20] border-2 border-transparent text-white rounded-2xl text-sm transition-all duration-300 placeholder:text-gray-600 focus:border-[#a78bfa]/30"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                className="w-full px-5 py-4 bg-[#1a1c20] border-2 border-transparent text-white rounded-2xl text-sm transition-all duration-300 placeholder:text-gray-600 focus:border-[#a78bfa]/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Password
                </label>
                {!isSignup && (
                  <button type="button" className="text-xs font-semibold text-[#a78bfa] hover:opacity-80 transition-opacity">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className="w-full px-5 py-4 bg-[#1a1c20] border-2 border-transparent text-white rounded-2xl text-sm transition-all duration-300 placeholder:text-gray-600 focus:border-[#a78bfa]/30 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
              {(localError || authError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-medium"
                >
                  <AlertCircle size={16} />
                  {localError || authError}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-medium"
                >
                  <CheckCircle2 size={16} />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-[#a78bfa] hover:bg-[#c084fc] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Mode Toggle */}
          <div className="mt-8 text-center px-4">
            <span className="text-gray-500 text-sm font-medium">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            </span>
            <button
              onClick={toggleMode}
              className="text-[#a78bfa] text-sm font-bold hover:underline underline-offset-4 transition-all"
            >
              {isSignup ? 'Login' : 'Create one'}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-600 text-[10px] uppercase tracking-widest font-bold">
          Protected by CashCompass Security
        </p>
      </motion.div>
    </div>
  )
}
