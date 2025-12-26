import { useState, type ReactNode } from 'react';

interface FilterGroupProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function FilterGroup({ title, children, defaultOpen = false }: FilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border py-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-medium text-textPrimary hover:text-accent transition-colors"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}
