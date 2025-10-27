import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDay } from './components/CalendarDay'
import { MonthStats } from './components/MonthStats'
import { useChillTracker } from './hooks/useChillTracker'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { toggleDay, getDay, getMonthStats } = useChillTracker()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const stats = getMonthStats(year, month)

  // Get calendar grid (including previous/next month days)
  const getCalendarDays = () => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Array<{ day: number, isCurrentMonth: boolean, date: string }> = []

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i
      const prevMonth = month === 0 ? 11 : month - 1
      const prevYear = month === 0 ? year - 1 : year
      days.push({
        day,
        isCurrentMonth: false,
        date: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      })
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonth = month === 11 ? 0 : month + 1
      const nextYear = month === 11 ? year + 1 : year
      days.push({
        day,
        isCurrentMonth: false,
        date: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      })
    }

    return days
  }

  const calendarDays = getCalendarDays()
  const today = new Date().toISOString().split('T')[0]

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="w-full max-w-4xl">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-6 md:p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            0 Chill Tracker
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Track your chill vs no-chill days
          </motion.p>
        </div>

        {/* Stats */}
        <MonthStats {...stats} />

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md"
          >
            ← Prev
          </button>

          <div className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={goToToday}
              className="text-sm text-purple-600 hover:text-purple-700 mt-1"
            >
              Today
            </button>
          </div>

          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md"
          >
            Next →
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayInfo, index) => (
            <CalendarDay
              key={index}
              day={dayInfo.day}
              value={getDay(dayInfo.date)}
              isCurrentMonth={dayInfo.isCurrentMonth}
              isToday={dayInfo.date === today}
              onClick={() => toggleDay(dayInfo.date)}
            />
          ))}
        </div>

        {/* Legend */}
        <motion.div
          className="mt-6 flex flex-wrap justify-center gap-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-chill-green rounded flex items-center justify-center text-white">
              🤙
            </div>
            <span className="text-gray-700">Chill (1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-no-chill-red rounded flex items-center justify-center text-white font-bold">
              0
            </div>
            <span className="text-gray-700">No Chill (0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-neutral-day rounded flex items-center justify-center text-gray-700">
              •
            </div>
            <span className="text-gray-700">Not tracked</span>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="mt-6 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Click a day to cycle: Untracked → Chill (🤙) → No Chill (0) → Untracked
        </motion.div>
      </motion.div>
    </div>
  )
}

export default App
