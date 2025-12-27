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
  const getStyles = () => {
    if (!isCurrentMonth) {
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-300',
        shadow: '',
        hover: ''
      }
    }

    if (value === 1) {
      return {
        bg: 'bg-gradient-to-br from-chill-green-light to-chill-green-deep',
        text: 'text-white',
        shadow: 'shadow-md',
        hover: 'hover:shadow-lg hover:scale-105'
      }
    }

    if (value === 0) {
      return {
        bg: 'bg-gradient-to-br from-chill-red to-chill-red-deep',
        text: 'text-white',
        shadow: 'shadow-md',
        hover: 'hover:shadow-lg hover:scale-105'
      }
    }

    if (isToday) {
      return {
        bg: 'bg-white',
        text: 'text-gray-700',
        shadow: 'shadow-md ring-2 ring-magenta-vibrant ring-offset-2',
        hover: 'hover:shadow-xl hover:scale-105'
      }
    }

    return {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      shadow: 'shadow-sm',
      hover: 'hover:shadow-md hover:scale-105 hover:bg-gray-200'
    }
  }

  const getContent = () => {
    if (!isCurrentMonth) return day
    if (value === 1) return '🤙'
    if (value === 0) return '0'
    return day
  }

  const styles = getStyles()

  return (
    <motion.button
      onClick={onClick}
      disabled={!isCurrentMonth}
      className={`
        aspect-square rounded-xl flex flex-col items-center justify-center
        ${styles.bg} ${styles.text} ${styles.shadow}
        font-bold text-lg
        transition-all duration-300
        disabled:cursor-not-allowed
        relative
        ${isCurrentMonth ? styles.hover : ''}
      `}
      whileHover={isCurrentMonth ? { scale: 1.05, y: -2 } : {}}
      whileTap={isCurrentMonth ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`${value !== null ? 'text-3xl' : 'text-lg'} font-black`}>
        {getContent()}
      </div>
      {isCurrentMonth && value === null && isToday && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-magenta-vibrant rounded-full animate-pulse"></div>
      )}
    </motion.button>
  )
}
