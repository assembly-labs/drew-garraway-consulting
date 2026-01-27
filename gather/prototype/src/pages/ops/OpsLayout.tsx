import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, ScanLine, RotateCcw } from 'lucide-react';
import { useOps } from '../../context/OpsContext';

const navItems = [
  { to: '/ops', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/ops/orders', label: 'Orders', icon: Package, end: false },
  { to: '/ops/pick-lists', label: 'Pick Lists', icon: ClipboardList, end: false },
  { to: '/ops/check-in', label: 'Check-in', icon: ScanLine, end: false },
];

export default function OpsLayout() {
  const location = useLocation();
  const { resetOrders } = useOps();

  // Get current page title
  const getPageTitle = () => {
    if (location.pathname === '/ops') return 'Market Day Overview';
    if (location.pathname === '/ops/orders') return 'Orders';
    if (location.pathname === '/ops/pick-lists') return 'Pick Lists';
    if (location.pathname === '/ops/check-in') return 'Check-in';
    return 'Operations';
  };

  // Get market day info
  const getMarketDayInfo = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return now.toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#E3E2E0] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FFE082] via-[#81C784] to-[#4CAF50] rounded-lg" />
            <div>
              <h1 className="text-lg font-bold text-[#37352F] font-['DM_Sans']">
                Gather <span className="font-normal text-[#787774]">Operations</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetOrders}
              className="p-2 text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3] rounded-lg transition-colors"
              title="Reset demo data"
            >
              <RotateCcw size={18} />
            </button>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#37352F]">{getMarketDayInfo()}</p>
              <p className="text-xs text-[#787774]">Berwyn Market</p>
            </div>
          </div>
        </div>
      </header>

      {/* Page Title Bar */}
      <div className="bg-white border-b border-[#E3E2E0] px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-base font-semibold text-[#37352F]">{getPageTitle()}</h2>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#E3E2E0] px-2 py-1 z-50">
        <div className="max-w-lg mx-auto flex justify-around">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors min-w-[72px] ${
                  isActive
                    ? 'text-[#4A7C28] bg-[#E8F5E9]'
                    : 'text-[#787774] hover:text-[#37352F] hover:bg-[#F7F6F3]'
                }`
              }
            >
              <Icon size={24} strokeWidth={2} />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
