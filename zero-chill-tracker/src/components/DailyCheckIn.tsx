import { motion } from 'framer-motion'

interface DailyCheckInProps {
  onZeroChill: () => void
  onChill: () => void
  todayDate: string
}

export function DailyCheckIn({ onZeroChill, onChill, todayDate }: DailyCheckInProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Date at top */}
        <motion.div
          className="text-gray-500 text-sm md:text-base mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {formatDate(todayDate)}
        </motion.div>

        {/* Big ZERO CHILL button */}
        <motion.button
          onClick={onZeroChill}
          className="
            w-[300px] h-[300px]
            md:w-[400px] md:h-[400px]
            bg-gradient-to-br from-red-500 to-red-700
            rounded-full
            shadow-2xl
            flex flex-col items-center justify-center
            text-white
            transition-all duration-300
            hover:shadow-3xl hover:scale-105
            active:scale-95
            mb-8
          "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div className="text-6xl md:text-8xl font-black tracking-tight leading-none">
            ZERO
          </div>
          <div className="text-6xl md:text-8xl font-black tracking-tight leading-none">
            CHILL
          </div>
          <div className="text-8xl md:text-9xl mt-4">0</div>
        </motion.button>

        {/* Chill option */}
        <motion.button
          onClick={onChill}
          className="
            px-8 py-4
            bg-gradient-to-r from-green-500 to-green-600
            text-white
            rounded-full
            text-xl md:text-2xl
            font-semibold
            shadow-lg
            hover:shadow-xl
            hover:scale-105
            active:scale-95
            transition-all duration-300
          "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Actually, it was chill 🤙
        </motion.button>

        {/* Subtle instruction */}
        <motion.p
          className="mt-8 text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Press the button only if today had ZERO CHILL
        </motion.p>
      </motion.div>
    </div>
  )
}
