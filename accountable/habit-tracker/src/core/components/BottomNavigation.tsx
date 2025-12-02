import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/calendar', label: 'Calendar', icon: '📅' },
  { path: '/', label: 'Today', icon: '✓' },
  { path: '/progress', label: 'Progress', icon: '📊' },
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      {/* Glass effect background */}
      <div className="glass border-t border-white/20">
        <div className="flex justify-around items-center py-2 safe-x">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex flex-col items-center justify-center
                  touch-target px-6 py-2 rounded-xl
                  transition-smooth
                  ${isActive
                    ? 'text-blue-600'
                    : 'text-gray-500'
                  }
                `}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-100 rounded-xl"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}

                {/* Icon with subtle bounce animation */}
                <motion.span
                  className="text-2xl relative z-10"
                  animate={isActive ? {
                    y: [0, -2, 0],
                  } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isActive ? 1 : 0,
                  }}
                >
                  {item.icon}
                </motion.span>

                {/* Label */}
                <span className={`
                  text-xs mt-1 font-medium relative z-10
                  ${isActive ? 'font-semibold' : ''}
                `}>
                  {item.label}
                </span>

                {/* Haptic feedback on tap */}
                {isActive && (
                  <script
                    dangerouslySetInnerHTML={{
                      __html: `
                        if ('vibrate' in navigator) {
                          navigator.vibrate(10);
                        }
                      `,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};