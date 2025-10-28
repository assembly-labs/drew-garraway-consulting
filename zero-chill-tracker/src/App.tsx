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
                className="text-white/70 hover:text-white text-sm font-semibold tracking-wide transition-all duration-300 underline decoration-2 underline-offset-4 hover:decoration-red-500"
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
              className="text-center max-w-lg bg-white/5 backdrop-blur-md rounded-3xl p-12 shadow-2xl"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Confirmation Message */}
              <motion.div
                className={`text-9xl mb-8 drop-shadow-2xl`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                {todayChoice === 0 ? '0' : '🤙'}
              </motion.div>

              <motion.h2
                className="text-5xl md:text-6xl font-black text-white mb-4 gradient-text tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {todayChoice === 0 ? 'ZERO CHILL' : 'Chill Day!'}
              </motion.h2>

              <motion.p
                className="text-white/70 text-lg mb-10 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {todayChoice === 0 ? 'Marked for today' : 'Marked for today'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={handleViewCalendar}
                  className="px-8 py-4 bg-gradient-to-br from-slate-700 to-slate-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                >
                  View Calendar
                </button>
                <button
                  onClick={handleBackToDaily}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30"
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
