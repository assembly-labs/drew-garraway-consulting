import { motion } from 'framer-motion'
import { ChillValue } from '../hooks/useChillTracker'

interface CalendarDayProps {
  day: number
  value: ChillValue
  isCurrentMonth: boolean
  isToday: boolean
  onClick: () => void
}

export function CalendarDay({ day, value, isCurrentMonth, isToday, onClick }: CalendarDayProps) {
  const getBackgroundColor = () => {
    if (!isCurrentMonth) return 'bg-gray-100'
    if (value === 1) return 'bg-chill-green'
    if (value === 0) return 'bg-no-chill-red'
    return isToday ? 'bg-blue-100 border-2 border-blue-400' : 'bg-neutral-day'
  }

  const getTextColor = () => {
    if (!isCurrentMonth) return 'text-gray-400'
    if (value === 1 || value === 0) return 'text-white'
    return 'text-gray-700'
  }

  const getContent = () => {
    if (!isCurrentMonth) return day
    if (value === 1) return '🤙'
    if (value === 0) return '0'
    return day
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={!isCurrentMonth}
      className={`
        aspect-square rounded-lg flex flex-col items-center justify-center
        ${getBackgroundColor()} ${getTextColor()}
        font-semibold text-lg shadow-sm
        hover:shadow-md transition-shadow
        disabled:cursor-not-allowed
        relative
      `}
      whileHover={isCurrentMonth ? { scale: 1.05 } : {}}
      whileTap={isCurrentMonth ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-2xl">
        {getContent()}
      </div>
      {isCurrentMonth && value === null && (
        <div className="text-xs mt-0.5 opacity-70">
          {day}
        </div>
      )}
    </motion.button>
  )
}
