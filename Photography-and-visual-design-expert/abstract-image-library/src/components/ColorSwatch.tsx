interface ColorSwatchProps {
  color: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

export default function ColorSwatch({ color, name, isActive, onClick }: ColorSwatchProps) {
  return (
    <button
      onClick={onClick}
      title={name}
      className={`relative w-7 h-7 rounded-full transition-all duration-200 ${
        isActive ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface scale-110' : 'hover:scale-110'
      }`}
      style={{
        background: color,
        border: name === 'white' ? '1px solid #262626' : 'none',
      }}
    >
      {isActive && (
        <svg
          className="absolute inset-0 m-auto w-3.5 h-3.5"
          fill="none"
          stroke={name === 'white' || name === 'yellow' ? '#000' : '#fff'}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  );
}
