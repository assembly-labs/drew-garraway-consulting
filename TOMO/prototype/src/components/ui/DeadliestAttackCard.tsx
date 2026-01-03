/**
 * DeadliestAttackCard Component
 *
 * Displays the user's most effective submission technique.
 * Only visible after 50 total submissions (to ensure statistical significance).
 * Features a skull line art icon.
 */

interface DeadliestAttackCardProps {
  technique: string;
  count: number;
}

// Skull line art SVG icon
function SkullIcon({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Skull outline */}
      <path d="M24 4C14 4 8 12 8 22C8 28 10 32 14 35V42C14 43.1 14.9 44 16 44H32C33.1 44 34 43.1 34 42V35C38 32 40 28 40 22C40 12 34 4 24 4Z" />
      {/* Left eye socket */}
      <circle cx="17" cy="22" r="4" />
      {/* Right eye socket */}
      <circle cx="31" cy="22" r="4" />
      {/* Nose */}
      <path d="M24 26V31" />
      <path d="M22 31L24 33L26 31" />
      {/* Teeth line */}
      <path d="M18 38H30" />
      <path d="M20 35V38" />
      <path d="M24 35V38" />
      <path d="M28 35V38" />
    </svg>
  );
}

export function DeadliestAttackCard({ technique, count }: DeadliestAttackCardProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(252, 211, 77, 0.15) 0%, var(--color-black) 100%)',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Icon */}
      <div style={{ color: 'var(--color-gold)' }}>
        <SkullIcon size={48} />
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--color-gold)',
        }}
      >
        Deadliest Attack
      </div>

      {/* Technique name */}
      <div
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--color-white)',
          lineHeight: 1.2,
          textTransform: 'capitalize',
        }}
      >
        {technique}
      </div>

      {/* Count */}
      <div
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-400)',
        }}
      >
        {count} taps with this attack
      </div>
    </div>
  );
}

export default DeadliestAttackCard;
