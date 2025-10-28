import { motion } from 'framer-motion'

interface MonthStatsProps {
  chillDays: number
  noChillDays: number
  totalTracked: number
  chillPercentage: number
}

export function MonthStats({ chillDays, noChillDays, totalTracked, chillPercentage }: MonthStatsProps) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <StatCard
        label="Chill Days"
        value={chillDays}
        gradient="from-chill-green-light via-chill-green to-chill-green-deep"
      />
      <StatCard
        label="No Chill Days"
        value={noChillDays}
        gradient="from-chill-red via-chill-red-deep to-chill-red-darker"
      />
      <StatCard
        label="Total Tracked"
        value={totalTracked}
        gradient="from-slate-700 via-slate-600 to-slate-500"
      />
      <StatCard
        label="Chill Rate"
        value={`${chillPercentage}%`}
        gradient="from-slate-700 via-slate-600 to-slate-500"
      />
    </motion.div>
  )
}

function StatCard({ label, value, gradient }: { label: string, value: string | number, gradient: string }) {
  return (
    <motion.div
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group`}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 5px 10px -5px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Shine overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[140px]">
        <div className="text-4xl md:text-5xl font-black mb-3 tracking-tight drop-shadow-md">{value}</div>
        <div className="text-xs md:text-sm font-semibold opacity-90 uppercase tracking-wide">{label}</div>
      </div>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  )
}
