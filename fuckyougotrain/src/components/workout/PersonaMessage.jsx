import { useEffect, useState } from 'react';

export function PersonaMessage({ persona, message, name, onDismiss, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onDismiss?.();
      }, 300); // Wait for slide-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-red-600 text-white p-4 rounded-lg shadow-xl z-40 transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-bold text-sm mb-1">{name}</p>
          <p className="text-base">{message}</p>
        </div>
        <button
          className="ml-2 text-white text-xl leading-none hover:text-gray-200"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
