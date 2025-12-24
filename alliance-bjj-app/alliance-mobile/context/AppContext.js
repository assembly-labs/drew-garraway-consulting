import React, { createContext, useContext, useState } from 'react';

// Create the context
const AppContext = createContext();

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Static mock data for prototype
const MOCK_USER = {
  id: '1',
  name: 'John Smith',
  email: 'john@example.com',
  belt: 'Blue',
  stripes: 3,
  memberSince: '2022-03-15',
  gym: 'Alliance BJJ Paoli',
  profileImage: null,
  membershipStatus: 'active',
  nextPayment: '2024-02-01'
};

const MOCK_SCHEDULE = [
  { id: '1', day: 'Monday', time: '6:00 PM', type: 'Gi', instructor: 'Prof. Mike', level: 'All Levels' },
  { id: '2', day: 'Tuesday', time: '7:30 PM', type: 'No-Gi', instructor: 'Coach Sarah', level: 'Advanced' },
  { id: '3', day: 'Wednesday', time: '6:00 PM', type: 'Gi', instructor: 'Prof. Mike', level: 'Beginners' },
  { id: '4', day: 'Thursday', time: '7:30 PM', type: 'No-Gi', instructor: 'Coach Tom', level: 'All Levels' },
  { id: '5', day: 'Friday', time: '6:00 PM', type: 'Open Mat', instructor: 'Various', level: 'All Levels' },
];

const MOCK_PROGRESS = {
  currentBelt: 'Blue',
  stripes: 3,
  totalClasses: 247,
  weeklyClasses: 3,
  monthlyClasses: 14,
  classHistory: [
    { date: '2024-01-15', type: 'Gi', instructor: 'Prof. Mike' },
    { date: '2024-01-13', type: 'No-Gi', instructor: 'Coach Sarah' },
    { date: '2024-01-11', type: 'Gi', instructor: 'Prof. Mike' },
  ]
};

const MOCK_CHECKIN_HISTORY = [
  { id: '1', date: '2024-01-15', time: '6:00 PM', className: 'Gi Class' },
  { id: '2', date: '2024-01-13', time: '7:30 PM', className: 'No-Gi Class' },
  { id: '3', date: '2024-01-11', time: '6:00 PM', className: 'Gi Class' },
];

// AppProvider component - PROTOTYPE VERSION
export const AppProvider = ({ children }) => {
  // Static states - always authenticated for prototype
  const [user] = useState(MOCK_USER);
  const [isAuthenticated] = useState(true);
  const [isLoading] = useState(false);

  // Static app data
  const [schedule] = useState(MOCK_SCHEDULE);
  const [checkInHistory, setCheckInHistory] = useState(MOCK_CHECKIN_HISTORY);
  const [progress, setProgress] = useState(MOCK_PROGRESS);
  const [notifications] = useState([]);
  const [payments] = useState([]);

  // Stub functions - no real functionality, just for UI clicks
  const login = () => {
    // Instant success for prototype
    return { success: true };
  };

  const logout = () => {
    // Does nothing in prototype
    console.log('Logout clicked - prototype mode');
  };

  const checkInToClass = (classData) => {
    // Just add to UI list, no persistence
    const checkIn = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      className: classData.type + ' Class',
      ...classData
    };

    setCheckInHistory([checkIn, ...checkInHistory]);

    // Update progress display (no persistence)
    setProgress({
      ...progress,
      totalClasses: progress.totalClasses + 1,
      weeklyClasses: progress.weeklyClasses + 1,
      monthlyClasses: progress.monthlyClasses + 1,
    });

    return { success: true, checkIn };
  };

  const updateProfile = () => {
    // Stub - does nothing but returns success
    return { success: true };
  };

  const loadUserData = () => {
    // Stub - data is already loaded statically
  };

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    schedule,
    checkInHistory,
    progress,
    notifications,
    payments,

    // Actions (all stubs for prototype)
    login,
    logout,
    checkInToClass,
    updateProfile,
    loadUserData,

    // State setters - only active ones exposed for prototype
    setCheckInHistory,
    setProgress
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};