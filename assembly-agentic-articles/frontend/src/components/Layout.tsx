import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PenTool, Home, FileText, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-bg-secondary border-r border-border">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Content AI</h1>
              <p className="text-xs text-text-secondary">Research & Publish</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/dashboard')
                  ? 'bg-surface text-accent'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/create"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/create')
                  ? 'bg-surface text-accent'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              }`}
            >
              <PenTool className="w-5 h-5" />
              <span className="font-medium">Create Content</span>
            </Link>

            <Link
              to="/drafts"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/drafts')
                  ? 'bg-surface text-accent'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">My Drafts</span>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-secondary">Total Drafts</p>
              <p className="text-xl font-semibold text-text-primary">24</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Published</p>
              <p className="text-xl font-semibold text-success">18</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;