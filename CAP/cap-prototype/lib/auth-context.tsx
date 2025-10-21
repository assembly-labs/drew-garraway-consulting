'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Team, generateTeam, MOCK_USERS } from './mock-data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, role: UserRole, name: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  teams: Team[];
  addTeam: (team: Team) => void;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);

  // Load user and teams from localStorage on mount
  useEffect(() => {
    try {
      // Check if localStorage is available
      const testKey = 'cap-test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);

      const storedUser = localStorage.getItem('cap-prototype-user');
      const storedTeams = localStorage.getItem('cap-prototype-teams');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }

      if (storedTeams) {
        setTeams(JSON.parse(storedTeams));
      } else {
        // Generate some sample teams for demo purposes
        const sampleTeams: Team[] = [];
        if (!storedTeams && !storedUser) {
          // Create sample teams for each sport
          const sports = ['hockey', 'football', 'baseball', 'soccer', 'lacrosse', 'basketball'] as const;
          sports.forEach((sport, index) => {
            if (index < 3) { // Create 3 sample teams
              sampleTeams.push(generateTeam(sport, 'demo-user'));
            }
          });
          setTeams(sampleTeams);
          try {
            localStorage.setItem('cap-prototype-teams', JSON.stringify(sampleTeams));
          } catch (e) {
            console.warn('Could not save teams to localStorage:', e);
          }
        }
      }
    } catch (error) {
      console.warn('localStorage is not available, using memory storage only:', error);
      // Generate default teams anyway
      const sampleTeams: Team[] = [];
      const sports = ['hockey', 'football', 'baseball', 'soccer', 'lacrosse', 'basketball'] as const;
      sports.forEach((sport, index) => {
        if (index < 3) {
          sampleTeams.push(generateTeam(sport, 'demo-user'));
        }
      });
      setTeams(sampleTeams);
    }

    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('cap-prototype-user', JSON.stringify(user));
      } else {
        localStorage.removeItem('cap-prototype-user');
      }
    } catch (error) {
      console.warn('Could not save user to localStorage:', error);
    }
  }, [user]);

  // Save teams to localStorage whenever they change
  useEffect(() => {
    try {
      if (teams.length > 0) {
        localStorage.setItem('cap-prototype-teams', JSON.stringify(teams));
      }
    } catch (error) {
      console.warn('Could not save teams to localStorage:', error);
    }
  }, [teams]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if it's one of our mock users
    const mockUser = MOCK_USERS.find(u => u.email === email);
    if (mockUser && password === 'demo123') {
      setUser({ ...mockUser, teams: teams.filter(t => t.ownerId === mockUser.id).map(t => t.id) });
      return true;
    }

    // Check localStorage for custom users
    try {
      const storedUsers = localStorage.getItem('cap-prototype-users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const foundUser = users.find((u: User) => u.email === email);
        if (foundUser) {
          setUser(foundUser);
          return true;
        }
      }
    } catch (error) {
      console.warn('Could not access localStorage:', error);
    }

    return false;
  };

  const signup = async (
    email: string,
    password: string,
    role: UserRole,
    name: string
  ): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      role,
      name,
      teams: [],
    };

    // Save to localStorage
    try {
      const storedUsers = localStorage.getItem('cap-prototype-users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      users.push(newUser);
      localStorage.setItem('cap-prototype-users', JSON.stringify(users));
    } catch (error) {
      console.warn('Could not save user to localStorage:', error);
    }

    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    // Find the mock user for this role
    const mockUser = MOCK_USERS.find(u => u.role === role);
    if (mockUser) {
      setUser({ ...mockUser, teams: teams.filter(t => t.ownerId === mockUser.id).map(t => t.id) });
    }
  };

  const addTeam = (team: Team) => {
    setTeams(prev => [...prev, team]);
    if (user) {
      setUser({
        ...user,
        teams: [...(user.teams || []), team.id],
      });
    }
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, ...updates } : team
    ));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        switchRole,
        teams,
        addTeam,
        updateTeam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}