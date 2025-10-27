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
        className="text-center max-w-[600px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Date at top */}
        <motion.div
          className="text-white/60 text-sm uppercase tracking-widest mb-16 font-semibold gradient-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {formatDate(todayDate)}
        </motion.div>

        {/* Big ZERO CHILL button - Photorealistic */}
        <motion.button
          onClick={onZeroChill}
          className="photorealistic-button relative group mb-12"
          style={{
            width: '300px',
            height: '300px',
          }}
          whileHover={{ scale: 1.05, y: -8 }}
          whileTap={{ scale: 0.97, y: 2 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
        >
          {/* Glossy shine effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 opacity-30 group-hover:opacity-40 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(ellipse at center top, rgba(255, 255, 255, 0.8) 0%, transparent 60%)',
              }}
            />
          </div>

          {/* Button content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className="text-6xl md:text-7xl font-black tracking-tighter leading-none drop-shadow-lg">
              ZERO
            </div>
            <div className="text-6xl md:text-7xl font-black tracking-tighter leading-none drop-shadow-lg">
              CHILL
            </div>
            <div className="text-7xl md:text-8xl mt-3 font-black drop-shadow-lg">0</div>
          </div>

          {/* Hover glow */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: '0 0 40px rgba(220, 38, 38, 0.6), 0 0 80px rgba(220, 38, 38, 0.3)',
            }}
          />
        </motion.button>

        {/* Chill option - More subtle secondary style */}
        <motion.button
          onClick={onChill}
          className="
            relative overflow-hidden
            px-10 py-4
            rounded-full
            text-lg md:text-xl
            font-semibold
            text-white
            transition-all duration-300
            hover:scale-105
            active:scale-95
            group
          "
          style={{
            background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.9) 0%, rgba(4, 120, 87, 0.9) 100%)',
            boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{
            boxShadow: '0 12px 24px rgba(5, 150, 105, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Actually, it was chill 🤙</span>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
            <div
              className="absolute top-0 left-0 w-full h-1/2"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 100%)',
              }}
            />
          </div>
        </motion.button>

        {/* Subtle instruction */}
        <motion.p
          className="mt-10 text-white/50 text-xs tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Press the button only if today had ZERO CHILL
        </motion.p>
      </motion.div>

      <style>{`
        .photorealistic-button {
          background: linear-gradient(135deg, #ff6b6b 0%, #DC2626 50%, #991B1B 100%);
          border-radius: 9999px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow:
            0 4px 6px -1px rgba(220, 38, 38, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.3),
            inset 0 -3px 8px rgba(127, 29, 29, 0.5),
            inset 0 1px 2px rgba(255, 107, 107, 0.3);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .photorealistic-button:hover {
          box-shadow:
            0 20px 30px -5px rgba(220, 38, 38, 0.4),
            0 10px 20px -5px rgba(0, 0, 0, 0.3),
            inset 0 -3px 8px rgba(127, 29, 29, 0.5),
            inset 0 1px 2px rgba(255, 107, 107, 0.4);
        }

        .photorealistic-button:active {
          box-shadow:
            inset 0 4px 8px rgba(127, 29, 29, 0.6),
            inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        @media (min-width: 768px) {
          .photorealistic-button {
            width: 400px;
            height: 400px;
          }
        }
      `}</style>
    </div>
  )
}
