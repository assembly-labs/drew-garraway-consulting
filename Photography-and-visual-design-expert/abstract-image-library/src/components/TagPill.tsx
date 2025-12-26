interface TagPillProps {
  tag: string;
  isActive: boolean;
  onClick: () => void;
}

export default function TagPill({ tag, isActive, onClick }: TagPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
        isActive
          ? 'bg-accent text-white'
          : 'bg-surfaceHover text-textSecondary hover:bg-border hover:text-textPrimary'
      }`}
    >
      {tag}
    </button>
  );
}
