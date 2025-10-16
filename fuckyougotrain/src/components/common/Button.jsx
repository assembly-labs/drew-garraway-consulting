export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = ''
}) {
  const baseClasses = "font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform";

  const variants = {
    primary: "bg-red-600 hover:bg-red-700 text-white py-4 px-8 text-xl min-h-[56px]",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6",
    danger: "bg-red-700 hover:bg-red-800 text-white py-3 px-6",
    ghost: "bg-transparent border-2 border-gray-600 hover:border-red-600 text-white py-3 px-6",
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
}
