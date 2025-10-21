'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/mock-data';
import { ChevronUp, ChevronDown, User, Camera, Shield, Users } from 'lucide-react';

const roleIcons = {
  parent: <User className="w-4 h-4" />,
  coach: <Users className="w-4 h-4" />,
  photographer: <Camera className="w-4 h-4" />,
  admin: <Shield className="w-4 h-4" />,
};

const roleColors = {
  parent: 'bg-cyan-500 text-dark-900',
  coach: 'bg-dark-700 text-cyan-400 border border-cyan-500/50',
  photographer: 'bg-cyan-600 text-dark-900',
  admin: 'bg-dark-800 text-cyan-400 border border-cyan-500',
};

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles: UserRole[] = ['parent', 'coach', 'photographer', 'admin'];

  return (
    <div className="role-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium"
      >
        <span>Role Switcher</span>
        {isOpen ? <ChevronDown /> : <ChevronUp />}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-400 mb-2">
            Switch between different user roles to test the experience
          </p>

          {user && (
            <div className="mb-3 p-2 bg-white/10 rounded text-xs">
              <p>Current: <span className="font-bold">{user.name}</span></p>
              <p className="text-gray-300">Role: {user.role}</p>
            </div>
          )}

          <div className="space-y-2">
            {roles.map(role => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={`w-full px-3 py-2 rounded-md text-left flex items-center gap-2 transition-colors ${
                  user?.role === role
                    ? roleColors[role]
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {roleIcons[role]}
                <span className="capitalize">{role}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 text-xs space-y-1">
            <p className="font-semibold">Quick Login Credentials:</p>
            <p>Email: [role]@test.com</p>
            <p>Password: demo123</p>
          </div>

          <button
            onClick={() => {
              try {
                localStorage.clear();
              } catch (e) {
                console.warn('Could not clear localStorage:', e);
              }
              window.location.href = '/';
            }}
            className="w-full mt-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
          >
            Reset All Data
          </button>
        </div>
      )}
    </div>
  );
}