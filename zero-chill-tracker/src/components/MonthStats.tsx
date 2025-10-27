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
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <StatCard
        label="Chill Days"
        value={chillDays}
        icon="🤙"
        color="bg-chill-green"
      />
      <StatCard
        label="No Chill Days"
        value={noChillDays}
        icon="0"
        color="bg-no-chill-red"
      />
      <StatCard
        label="Total Tracked"
        value={totalTracked}
        icon="📊"
        color="bg-purple-500"
      />
      <StatCard
        label="Chill Rate"
        value={`${chillPercentage}%`}
        icon="✨"
        color="bg-blue-500"
      />
    </motion.div>
  )
}

function StatCard({ label, value, icon, color }: { label: string, value: string | number, icon: string, color: string }) {
  return (
    <motion.div
      className={`${color} rounded-xl p-4 text-white shadow-lg`}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </motion.div>
  )
}
