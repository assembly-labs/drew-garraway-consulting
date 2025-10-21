'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ParentDashboard from '@/components/dashboards/ParentDashboard';
import CoachDashboard from '@/components/dashboards/CoachDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import PhotographerDashboard from '@/components/dashboards/PhotographerDashboard';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-6xl font-bold text-cyan-500 animate-pulse">CAP</div>
          <p className="font-body text-gray-300 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Role-specific dashboards */}
      {user.role === 'parent' && <ParentDashboard />}
      {user.role === 'coach' && <CoachDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'photographer' && <PhotographerDashboard />}
    </div>
  );
}