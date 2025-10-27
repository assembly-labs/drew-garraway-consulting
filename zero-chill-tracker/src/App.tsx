import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DailyCheckIn } from './components/DailyCheckIn'
import { CalendarView } from './components/CalendarView'
import { useChillTracker } from './hooks/useChillTracker'

type View = 'daily' | 'calendar' | 'confirmation'

function App() {
  const [view, setView] = useState<View>('daily')
  const [todayChoice, setTodayChoice] = useState<0 | 1 | null>(null)
  const { setDay } = useChillTracker()
  const today = new Date().toISOString().split('T')[0]

  const handleZeroChill = () => {
    setDay(today, 0)
    setTodayChoice(0)
    setView('confirmation')
  }

  const handleChill = () => {
    setDay(today, 1)
    setTodayChoice(1)
    setView('confirmation')
  }

  const handleViewCalendar = () => {
    setView('calendar')
  }

  const handleBackToDaily = () => {
    setView('daily')
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <AnimatePresence mode="wait">
        {view === 'daily' && (
          <motion.div
            key="daily"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <DailyCheckIn
              onZeroChill={handleZeroChill}
              onChill={handleChill}
              todayDate={today}
            />
            {/* View Calendar Link */}
            <motion.div
              className="fixed bottom-8 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <button
                onClick={handleViewCalendar}
                className="text-white/80 hover:text-white text-sm underline"
              >
                View Calendar
              </button>
            </motion.div>
          </motion.div>
        )}

        {view === 'confirmation' && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full flex flex-col items-center justify-center px-4"
          >
            <motion.div
              className="text-center"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              {/* Confirmation Message */}
              <motion.div
                className={`text-8xl mb-6`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                {todayChoice === 0 ? '0' : '🤙'}
              </motion.div>

              <motion.h2
                className="text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {todayChoice === 0 ? 'ZERO CHILL' : 'Chill Day!'}
              </motion.h2>

              <motion.p
                className="text-white/80 text-xl mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {todayChoice === 0 ? 'Marked for today' : 'Marked for today'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={handleViewCalendar}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Calendar
                </button>
                <button
                  onClick={handleBackToDaily}
                  className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {view === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full"
          >
            <CalendarView onBack={handleBackToDaily} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
