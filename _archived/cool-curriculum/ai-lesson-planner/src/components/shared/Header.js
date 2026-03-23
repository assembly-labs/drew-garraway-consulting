import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-fredoka">
            AI Lesson Planner
          </Link>
          <nav className="flex gap-6">
            <Link to="/" className="hover:text-blue-200 transition">Dashboard</Link>
            <Link to="/profiles" className="hover:text-blue-200 transition">Profiles</Link>
            <Link to="/library" className="hover:text-blue-200 transition">Library</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
