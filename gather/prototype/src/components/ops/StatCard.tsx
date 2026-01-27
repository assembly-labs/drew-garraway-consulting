interface StatCardProps {
  value: number;
  label: string;
  sublabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'muted';
  onClick?: () => void;
}

const variantStyles = {
  default: {
    bg: 'bg-white',
    border: 'border-[#E3E2E0]',
    valueBg: 'bg-[#FFF9C4]',
    valueText: 'text-[#E65100]',
  },
  success: {
    bg: 'bg-white',
    border: 'border-[#81C784]',
    valueBg: 'bg-[#E8F5E9]',
    valueText: 'text-[#2E7D32]',
  },
  warning: {
    bg: 'bg-white',
    border: 'border-[#FF6B6B]',
    valueBg: 'bg-[#FFEBEE]',
    valueText: 'text-[#C62828]',
  },
  muted: {
    bg: 'bg-[#F7F6F3]',
    border: 'border-[#E3E2E0]',
    valueBg: 'bg-white',
    valueText: 'text-[#787774]',
  },
};

export default function StatCard({ value, label, sublabel, variant = 'default', onClick }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 ${styles.bg} ${styles.border} text-left transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0`}
    >
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg ${styles.valueBg} mb-2`}>
        <span className={`text-2xl font-bold ${styles.valueText} font-['DM_Sans']`}>
          {value}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#37352F]">{label}</p>
      {sublabel && (
        <p className="text-xs text-[#787774] mt-0.5">{sublabel}</p>
      )}
    </button>
  );
}
