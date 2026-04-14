import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Grid3X3, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { fetchExpenses, fetchTotalExpenses, fetchCategorySummary, fetchMonthlySummary } from '../services/api'
import { useCurrency } from '../context/CurrencyContext'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

const CustomTooltip = ({ active, payload, label, symbol }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-xs"
        style={{
          backgroundColor: 'var(--color-bg-surface-high)',
          border: '1px solid rgba(65, 71, 81, 0.15)',
          boxShadow: 'var(--shadow-ambient)',
        }}
      >
        <p style={{ color: 'var(--color-text-muted)' }}>{label}</p>
        <p className="font-semibold" style={{ color: 'var(--color-primary)' }}>
          {symbol}{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      </div>
    )
  }
  return null
}

const getCategoryColor = (category) => {
  const colors = {
    Food: '#4d93e5',
    Transport: '#3aa45c',
    Shopping: '#a4c9ff',
    Bills: '#73dc8d',
    Entertainment: '#8b919d',
    Healthcare: '#c3c7ce',
    Education: '#e2a341',
    Housing: '#b065a3',
  }
  return colors[category] || '#414751'
}

const formatMonth = (monthNum) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[monthNum - 1] || ''
}

export default function Dashboard() {
  const { symbol } = useCurrency()
  const [isLoading, setIsLoading] = useState(true)
  const [monthlyData, setMonthlyData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [transactions, setTransactions] = useState([])
  const [totalExpenses, setTotalExpenses] = useState(0)

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true)
      try {
        const [
          expensesRes,
          totalRes,
          catSummaryRes,
          monthSummaryRes
        ] = await Promise.all([
          fetchExpenses(),
          fetchTotalExpenses(),
          fetchCategorySummary(),
          fetchMonthlySummary(),
        ])

        setTransactions(expensesRes.data || expensesRes) // handle both raw array or paginated object

        const totalAmt = totalRes.total !== undefined ? totalRes.total : totalRes
        setTotalExpenses(totalAmt || 0)

        const formattedCategories = (catSummaryRes || []).map(cat => ({
          name: cat._id,
          value: cat.total,
          color: getCategoryColor(cat._id)
        }))
        setCategoryData(formattedCategories)

        const formattedMonths = (monthSummaryRes || []).map(m => ({
          month: formatMonth(m._id),
          amount: m.total
        }))
        setMonthlyData(formattedMonths)

      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    )
  }

  // Calculate some derived stats
  const activeCategoriesCount = categoryData.length
  // Let's grab current month amount if available
  const currentMonthNum = new Date().getMonth() + 1
  const currentMonthSumObj = monthlyData.find(m => m.month === formatMonth(currentMonthNum))
  const currentMonthSum = currentMonthSumObj ? currentMonthSumObj.amount : 0

  const statCards = [
    {
      title: 'Total Expenses',
      value: `${symbol}${totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      trend: 'neutral',
      icon: DollarSign,
      subtitle: 'All time spending',
    },
    {
      title: 'Monthly Spending',
      value: `${symbol}${currentMonthSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      trend: 'neutral',
      icon: Calendar,
      subtitle: `In ${formatMonth(currentMonthNum)}`,
    },
    {
      title: 'Categories',
      value: activeCategoriesCount.toString(),
      trend: 'neutral',
      icon: Grid3X3,
      subtitle: 'Active categories',
    },
  ]

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={item}>
        <h1
          className="text-2xl font-semibold"
          style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
        >
          Portfolio Overview
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Detailed analysis of your monthly fiscal activity and asset allocation.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="rounded-xl p-5 transition-colors duration-200 cursor-default"
              style={{
                backgroundColor: 'var(--color-bg-surface)'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-bg-surface-high)' }}
                >
                  <Icon size={16} style={{ color: 'var(--color-text-muted)' }} />
                </div>
              </div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
                {stat.title}
              </p>
              <p
                className="text-2xl font-semibold"
                style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
              >
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {stat.subtitle}
              </p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bar Chart — Spending Velocity */}
        <motion.div
          variants={item}
          className="lg:col-span-3 rounded-xl p-5"
          style={{
            backgroundColor: 'var(--color-bg-surface)'
          }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Spending Velocity
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Monthly expenses tracking
          </p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barSize={24} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(65, 71, 81, 0.15)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#8b919d' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#8b919d' }}
                  tickFormatter={(v) => `${symbol}${v > 1000 ? (v / 1000).toFixed(1) + 'k' : v}`}
                />
                <Tooltip content={<CustomTooltip symbol={symbol} />} cursor={{ fill: 'rgba(65, 71, 81, 0.1)' }} />
                <Bar dataKey="amount" fill="#4d93e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart — Category Distribution */}
        <motion.div
          variants={item}
          className="lg:col-span-2 rounded-xl p-5"
          style={{
            backgroundColor: 'var(--color-bg-surface)'
          }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Category Distribution
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
            How your spending breaks down
          </p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${symbol}${value.toLocaleString('en-IN')}`, name]}
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-surface-high)',
                    border: '1px solid rgba(65, 71, 81, 0.4)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: 'var(--color-text-primary)',
                    boxShadow: 'var(--shadow-ambient)'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: '#8b919d', fontSize: '11px' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        variants={item}
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: 'var(--color-bg-surface)'
        }}
      >
        <div className="p-5 pb-3">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Recent Transactions
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Your latest financial activity
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-5 py-3 text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Transaction
                </th>
                <th className="text-left px-5 py-3 text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Category
                </th>
                <th className="text-left px-5 py-3 text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Date
                </th>
                <th className="text-right px-5 py-3 text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="stagger-children">
              {transactions.slice(0, 8).map((tx, idx) => (
                <motion.tr
                  key={tx._id || idx}
                  className="transition-colors duration-150 cursor-default"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-surface-high)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {tx.title}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--color-bg-surface-highest)',
                        color: getCategoryColor(tx.category),
                      }}
                    >
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {formatDate(tx.date || tx.createdAt)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-error)' }}>
                      −{symbol}{Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
