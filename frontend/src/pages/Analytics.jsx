import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { fetchCategorySummary, fetchMonthlySummary } from '../services/api'
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

const formatMonth = (monthNum) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[monthNum - 1] || ''
}

const getCategoryColor = (category) => {
  const colors = {
    Food: '#4d93e5', Transport: '#3aa45c', Shopping: '#a4c9ff', Bills: '#73dc8d',
    Entertainment: '#8b919d', Housing: '#b065a3', Health: '#ffb4ab', Other: '#414751'
  }
  return colors[category] || '#414751'
}

export default function Analytics() {
  const { symbol } = useCurrency()
  const [isLoading, setIsLoading] = useState(true)
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [categorySpending, setCategorySpending] = useState([])

  useEffect(() => {
    async function loadAnalytics() {
      setIsLoading(true)
      try {
        const [catSummaryRes, monthSummaryRes] = await Promise.all([
          fetchCategorySummary(),
          fetchMonthlySummary(),
        ])

        const formattedCategories = (catSummaryRes || []).map(cat => ({
          name: cat._id,
          value: cat.total,
          color: getCategoryColor(cat._id)
        }))
        setCategorySpending(formattedCategories)

        const formattedMonths = (monthSummaryRes || []).map(m => ({
          month: formatMonth(m._id),
          amount: m.total
        }))
        setMonthlyTrend(formattedMonths)
      } catch (error) {
        console.error('Failed to load analytics', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadAnalytics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    )
  }

  // Calculate current vs last month sum
  const currentMonthNum = new Date().getMonth() + 1
  const lastMonthNum = currentMonthNum === 1 ? 12 : currentMonthNum - 1

  const currentMonthSumObj = monthlyTrend.find(m => m.month === formatMonth(currentMonthNum))
  const lastMonthSumObj = monthlyTrend.find(m => m.month === formatMonth(lastMonthNum))

  const currentMonthSum = currentMonthSumObj ? currentMonthSumObj.amount : 0
  const lastMonthSum = lastMonthSumObj ? lastMonthSumObj.amount : 0

  let monthChange = 0
  if (lastMonthSum > 0) {
    monthChange = ((currentMonthSum - lastMonthSum) / lastMonthSum) * 100
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
          >
            Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Comprehensive view of your spending patterns and trends.
          </p>
        </div>
      </motion.div>

      {/* Monthly Trend Chart */}
      <motion.div
        variants={item}
        className="rounded-xl p-5"
        style={{
          backgroundColor: 'var(--color-bg-surface)'
        }}
      >
        <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Monthly Expense Trend
        </h3>
        <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
          Your spending trajectory over the past months
        </p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend} barSize={28}>
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

      {/* Bottom Row: Category Breakdown + Month-over-Month */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Donut */}
        <motion.div
          variants={item}
          className="rounded-xl p-5"
          style={{
            backgroundColor: 'var(--color-bg-surface)'
          }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Category Spending Breakdown
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
            How your budget is distributed
          </p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySpending}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {categorySpending.map((entry, index) => (
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

        {/* Month Comparison */}
        <motion.div
          variants={item}
          className="rounded-xl p-5"
          style={{
            backgroundColor: 'var(--color-bg-surface)'
          }}
        >
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Month-over-Month
          </h3>
          <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
            Comparing {formatMonth(currentMonthNum)} vs {formatMonth(lastMonthNum)}
          </p>

          {/* Summary */}
          <div className="flex items-center gap-6 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
                This Month
              </p>
              <p className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                {symbol}{currentMonthSum.toLocaleString('en-IN')}
              </p>
            </div>
            <div
              className="w-px h-10"
              style={{ backgroundColor: 'rgba(65, 71, 81, 0.2)' }}
            />
            <div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Last Month
              </p>
              <p className="text-xl font-semibold" style={{ color: 'var(--color-text-muted)', letterSpacing: '-0.02em' }}>
                {symbol}{lastMonthSum.toLocaleString('en-IN')}
              </p>
            </div>
            {lastMonthSum > 0 && (
              <div
                className="flex items-center gap-1 ml-auto px-3 py-1.5 rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: monthChange <= 0 ? 'rgba(58, 164, 92, 0.1)' : 'rgba(226, 74, 74, 0.1)',
                  color: monthChange <= 0 ? 'var(--color-tertiary)' : 'var(--color-error)',
                }}
              >
                {monthChange > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(monthChange).toFixed(1)}%
              </div>
            )}
          </div>

          {/* Category breakdown rendering can't be perfect without a dedicated comparison API, so let's render standard progress bars here */}
          <div className="space-y-3">
            <p className="text-[0.6875rem] font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Category Distribution
            </p>
            {categorySpending.map((cat) => (
              <motion.div
                key={cat.name}
                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors duration-150"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-surface-high)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium tabular-nums" style={{ color: 'var(--color-text-secondary)' }}>
                    {symbol}{cat.value.toLocaleString('en-IN')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
