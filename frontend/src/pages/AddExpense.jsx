import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, ChevronDown, Calendar, Tag, Type, Loader2, Utensils, Car, ShoppingBag, Receipt, Film, Activity, GraduationCap, Home, Heart, MoreHorizontal, Check } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { createExpense, fetchExpenseById, updateExpense } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'

const categories = [
  { id: 'Food', icon: Utensils, color: '#4d93e5' },
  { id: 'Transport', icon: Car, color: '#3aa45c' },
  { id: 'Shopping', icon: ShoppingBag, color: '#a4c9ff' },
  { id: 'Bills', icon: Receipt, color: '#ffb4ab' },
  { id: 'Entertainment', icon: Film, color: '#8b919d' },
  { id: 'Healthcare', icon: Activity, color: '#c3c7ce' },
  { id: 'Education', icon: GraduationCap, color: '#e2a341' },
  { id: 'Housing', icon: Home, color: '#b065a3' },
  { id: 'Health', icon: Heart, color: '#73dc8d' },
  { id: 'Other', icon: MoreHorizontal, color: '#414751' },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function AddExpense() {
  const { id } = useParams()
  const isEdit = !!id
  const { symbol } = useCurrency()
  const navigate = useNavigate()
  const [focused, setFocused] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  useEffect(() => {
    if (isEdit) {
      loadExpense()
    }
  }, [id])

  const loadExpense = async () => {
    try {
      const data = await fetchExpenseById(id)
      setForm({
        title: data.title,
        amount: data.amount.toString(),
        category: data.category,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
      })
    } catch (err) {
      console.error('Failed to load expense', err)
      alert('Failed to load expense data')
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.amount || !form.category || !form.date) return;

    setIsSubmitting(true)
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      if (isEdit) {
        await updateExpense(id, payload)
      } else {
        await createExpense(payload)
      }
      navigate('/expenses')
    } catch (error) {
      console.error('Failed to save expense', error)
      alert('Failed to save expense. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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
          {isEdit ? 'Edit Expense' : 'Add New Expense'}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {isEdit ? 'Update the details of your transaction.' : 'Record a new transaction to your ledger.'}
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        variants={item}
        className="rounded-xl p-6 lg:p-8"
        style={{
          backgroundColor: 'var(--color-bg-surface)'
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <motion.div variants={item}>
            <label
              className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Type size={12} />
              Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Weekly Groceries"
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={inputStyle('title')}
              onFocus={() => setFocused('title')}
              onBlur={() => setFocused(null)}
              disabled={isSubmitting}
            />
          </motion.div>

          {/* Amount */}
          <motion.div variants={item}>
            <label
              className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <DollarSign size={12} />
              Amount
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {symbol}
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 rounded-lg text-sm tabular-nums"
                style={inputStyle('amount')}
                onFocus={() => setFocused('amount')}
                onBlur={() => setFocused(null)}
                disabled={isSubmitting}
              />
            </div>
          </motion.div>

          {/* Category & Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <motion.div variants={item}>
              <label
                className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-wider mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Tag size={12} />
                Category
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full px-4 py-3 rounded-lg text-sm flex items-center justify-between transition-all duration-200"
                  style={{
                    ...inputStyle('category'),
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                  disabled={isSubmitting}
                >
                  <span className="flex items-center gap-2">
                    {form.category ? (
                      <>
                        {(() => {
                          const cat = categories.find(c => c.id === form.category);
                          const Icon = cat?.icon || Tag;
                          return <Icon size={14} style={{ color: cat?.color || 'inherit' }} />;
                        })()}
                        {form.category}
                      </>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>Select category</span>
                    )}
                  </span>
                  <motion.div
                    animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isCategoryOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-10"
                        onClick={() => setIsCategoryOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute left-0 right-0 mt-2 p-2 rounded-xl z-20 shadow-2xl border"
                        style={{
                          backgroundColor: 'var(--color-bg-surface-high)',
                          borderColor: 'rgba(65, 71, 81, 0.4)',
                          maxHeight: '280px',
                          overflowY: 'auto'
                        }}
                      >
                        <div className="grid grid-cols-1 gap-1">
                          {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = form.category === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  handleChange('category', cat.id);
                                  setIsCategoryOpen(false);
                                }}
                                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors duration-150"
                                style={{
                                  backgroundColor: isSelected ? 'rgba(164, 201, 255, 0.1)' : 'transparent',
                                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${cat.color}20` }}
                                  >
                                    <Icon size={16} style={{ color: cat.color }} />
                                  </div>
                                  <span className="font-medium">{cat.id}</span>
                                </div>
                                {isSelected && <Check size={14} />}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label
                className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-wider mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Calendar size={12} />
                Date
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{
                  ...inputStyle('date'),
                  colorScheme: 'dark',
                }}
                onFocus={() => setFocused('date')}
                onBlur={() => setFocused(null)}
                disabled={isSubmitting}
              />
            </motion.div>
          </div>


          {/* Buttons */}
          <motion.div
            variants={item}
            className="flex items-center justify-end gap-3 pt-4"
            style={{ borderTop: '1px solid transparent' }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate('/expenses')}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-surface-high)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
              }}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? 'Update Expense' : 'Save Expense'}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  )
}
