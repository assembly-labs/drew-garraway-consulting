import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/shared/Header';
import Dashboard from './pages/Dashboard';
import CreateMaterial from './pages/CreateMaterial';
import DraftReview from './pages/DraftReview';
import VisualEditor from './pages/VisualEditor';
import ProfileManager from './pages/ProfileManager';
import Library from './pages/Library';
import './styles/templates.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateMaterial />} />
            <Route path="/draft-review" element={<DraftReview />} />
            <Route path="/visual-editor" element={<VisualEditor />} />
            <Route path="/profiles" element={<ProfileManager />} />
            <Route path="/library" element={<Library />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
