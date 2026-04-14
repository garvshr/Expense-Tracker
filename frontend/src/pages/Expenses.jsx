import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search, Plus, Filter, SortAsc, SortDesc,
  Pencil, Trash2, ChevronLeft, ChevronRight,
  X, Loader2
} from 'lucide-react'
import { fetchExpenses, deleteExpense } from '../services/api'

const categories = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Housing', 'Health', 'Other']

const getCategoryColor = (category) => {
  const colors = {
    Food: '#4d93e5', Transport: '#3aa45c', Shopping: '#a4c9ff', Housing: '#c3c7ce',
    Entertainment: '#8b919d', Health: '#73dc8d', Bills: '#ffb4ab', Other: '#414751',
    Healthcare: '#c3c7ce', Education: '#e2a341',
  }
  return colors[category] || '#414751'
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Expenses() {
  const navigate = useNavigate()
  const [allExpenses, setAllExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortField, setSortField] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 8

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    try {
      setIsLoading(true)
      const data = await fetchExpenses()
      setAllExpenses(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await deleteExpense(id)
      setAllExpenses(prev => prev.filter(e => e._id !== id))
    } catch (err) {
      console.error('Failed to delete', err)
    }
  }

  const filtered = allExpenses
    .filter((e) => {
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase())
      const matchCategory = categoryFilter === 'All' || e.category === categoryFilter
      return matchSearch && matchCategory
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortField === 'date') return dir * (new Date(a.date) - new Date(b.date))
      if (sortField === 'amount') return dir * (a.amount - b.amount)
      return 0
    })

  const totalPages = Math.ceil(filtered.length / perPage) || 1
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
            Expenses
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {filtered.length} transactions found
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/add-expense')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
        >
          <Plus size={16} />
          Add Expense
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Search expenses..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              color: 'var(--color-text-primary)',
              border: '1px solid transparent',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1) }}
          className="px-4 py-2.5 rounded-lg text-sm cursor-pointer"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid transparent',
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
          ))}
        </select>

        {/* Sort buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => toggleSort('date')}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: sortField === 'date' ? 'var(--color-bg-surface-high)' : 'var(--color-bg-surface)',
              color: sortField === 'date' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              border: '1px solid transparent',
            }}
          >
            {sortField === 'date' && sortDir === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
            Date
          </button>
          <button
            onClick={() => toggleSort('amount')}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: sortField === 'amount' ? 'var(--color-bg-surface-high)' : 'var(--color-bg-surface)',
              color: sortField === 'amount' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              border: '1px solid transparent',
            }}
          >
            {sortField === 'amount' && sortDir === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
            Amount
          </button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        variants={item}
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-bg-surface)'
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '28%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
            </colgroup>
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Title</th>
                <th className="px-5 py-3 text-right text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Amount</th>
                <th className="px-5 py-3 text-left text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Category</th>
                <th className="px-5 py-3 text-left text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Date</th>
                <th className="px-5 py-3 text-right text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginated.map((expense, i) => (
                  <motion.tr
                    key={expense._id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="transition-colors duration-150 group"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-surface-high)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium truncate block" style={{ color: 'var(--color-text-primary)' }}>
                        {expense.title}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-sm font-semibold tabular-nums whitespace-nowrap" style={{ color: 'var(--color-text-primary)' }}>
                        ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap"
                        style={{
                          backgroundColor: 'var(--color-bg-surface-highest)',
                          color: getCategoryColor(expense.category),
                        }}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => navigate(`/edit/${expense._id}`)}
                          className="p-1.5 rounded-md transition-colors duration-200 cursor-pointer"
                          style={{ color: 'var(--color-text-muted)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--color-bg-surface-highest)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="p-1.5 rounded-md transition-colors duration-200 cursor-pointer disabled:opacity-50"
                          style={{ color: 'var(--color-text-muted)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-error)'; e.currentTarget.style.backgroundColor = 'var(--color-bg-surface-highest)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderTop: '1px solid transparent' }}
          >
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg transition-colors duration-200 disabled:opacity-30"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    backgroundColor: currentPage === page ? 'var(--color-bg-surface-high)' : 'transparent',
                    color: currentPage === page ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg transition-colors duration-200 disabled:opacity-30"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
