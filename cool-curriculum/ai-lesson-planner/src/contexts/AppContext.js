import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [rateLimitData, setRateLimitData] = useState({ regenerations: [] });
  const [libraryItems, setLibraryItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const profiles = localStorage.getItem('lesson_planner_profiles');
      const rateLimit = localStorage.getItem('lesson_planner_rate_limit');
      const library = localStorage.getItem('lesson_planner_library');
      const session = localStorage.getItem('lesson_planner_session');

      if (profiles) setStudentProfiles(JSON.parse(profiles));
      if (rateLimit) setRateLimitData(JSON.parse(rateLimit));
      if (library) setLibraryItems(JSON.parse(library));
      if (session) setUserSession(session);
      else {
        const newSession = `session_${Date.now()}`;
        localStorage.setItem('lesson_planner_session', newSession);
        setUserSession(newSession);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (studentProfiles.length > 0) {
      localStorage.setItem('lesson_planner_profiles', JSON.stringify(studentProfiles));
    }
  }, [studentProfiles]);

  useEffect(() => {
    localStorage.setItem('lesson_planner_rate_limit', JSON.stringify(rateLimitData));
  }, [rateLimitData]);

  useEffect(() => {
    if (libraryItems.length > 0) {
      localStorage.setItem('lesson_planner_library', JSON.stringify(libraryItems));
    }
  }, [libraryItems]);

  // Profile management
  const addProfile = (profile) => {
    const newProfile = {
      ...profile,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setStudentProfiles([...studentProfiles, newProfile]);
    return newProfile;
  };

  const updateProfile = (id, updates) => {
    setStudentProfiles(profiles =>
      profiles.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const deleteProfile = (id) => {
    setStudentProfiles(profiles => profiles.filter(p => p.id !== id));
  };

  // Rate limiting
  const checkRateLimit = () => {
    const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
    const recentRegens = rateLimitData.regenerations.filter(
      r => new Date(r.timestamp).getTime() > tenMinutesAgo
    );

    if (recentRegens.length >= 3) {
      const oldestRegen = recentRegens[0];
      const timeUntilReset = new Date(oldestRegen.timestamp).getTime() + (10 * 60 * 1000) - Date.now();
      const minutesRemaining = Math.ceil(timeUntilReset / 60000);
      return { allowed: false, minutesRemaining, count: recentRegens.length };
    }

    return { allowed: true, count: recentRegens.length };
  };

  const recordRegeneration = (materialId) => {
    setRateLimitData(data => ({
      regenerations: [...data.regenerations, {
        timestamp: new Date().toISOString(),
        materialId: materialId || 'draft'
      }]
    }));
  };

  // Library management
  const addToLibrary = (item) => {
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString()
    };
    setLibraryItems([...libraryItems, newItem]);
    return newItem;
  };

  const value = {
    userSession,
    studentProfiles,
    rateLimitData,
    libraryItems,
    addProfile,
    updateProfile,
    deleteProfile,
    checkRateLimit,
    recordRegeneration,
    addToLibrary
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
