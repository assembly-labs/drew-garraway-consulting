'use client';

export function PrototypeBanner() {
  return (
    <div className="prototype-banner">
      🎭 PROTOTYPE MODE - This is a demo with fake data |
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            try {
              localStorage.clear();
            } catch (e) {
              console.warn('Could not clear localStorage:', e);
            }
            window.location.href = '/';
          }
        }}
        className="ml-2 underline hover:no-underline"
      >
        Reset All Data
      </button>
    </div>
  );
}
