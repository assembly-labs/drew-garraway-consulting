import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDay } from './CalendarDay'
import { MonthStats } from './MonthStats'
import { useChillTracker } from '../hooks/useChillTracker'

interface CalendarViewProps {
  onBack: () => void
}

export function CalendarView({ onBack }: CalendarViewProps) {
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
    <div className="w-full max-w-5xl px-4">
      <motion.div
        className="bg-slate-900/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-gradient-to-br from-slate-700 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-500 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
          >
            ← Back
          </button>
          <motion.h1
            className="text-3xl md:text-4xl font-black gradient-text tracking-tight"
          >
            Zero Chill Tracker
          </motion.h1>
          <div className="w-[80px]"></div> {/* Spacer for centering */}
        </div>

        {/* Stats */}
        <MonthStats {...stats} />

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8 mt-8">
          <button
            onClick={previousMonth}
            className="px-6 py-3 bg-gradient-to-br from-slate-800 to-slate-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-semibold shadow-lg hover:scale-105 active:scale-95"
          >
            ← Prev
          </button>

          <div className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={goToToday}
              className="text-sm font-semibold text-red-400 hover:text-red-300 mt-2 transition-colors"
            >
              Jump to Today
            </button>
          </div>

          <button
            onClick={nextMonth}
            className="px-6 py-3 bg-gradient-to-br from-slate-800 to-slate-700 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-semibold shadow-lg hover:scale-105 active:scale-95"
          >
            Next →
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-3 mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-3">
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
          className="mt-8 flex flex-wrap justify-center gap-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2.5 bg-gradient-to-br from-chill-green-light to-chill-green-deep text-white px-4 py-2 rounded-xl shadow-md">
            <div className="text-xl">🤙</div>
            <span className="font-semibold">Chill (1)</span>
          </div>
          <div className="flex items-center gap-2.5 bg-gradient-to-br from-chill-red to-chill-red-deep text-white px-4 py-2 rounded-xl shadow-md">
            <div className="text-xl font-bold">0</div>
            <span className="font-semibold">No Chill (0)</span>
          </div>
          <div className="flex items-center gap-2.5 bg-slate-700 text-gray-300 px-4 py-2 rounded-xl shadow-md">
            <div className="text-xl">•</div>
            <span className="font-semibold">Not tracked</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
