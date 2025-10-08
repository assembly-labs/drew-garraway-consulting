import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateContent from './pages/CreateContent';
import DraftDetail from './pages/DraftDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-primary">
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateContent />} />
            <Route path="/draft/:id" element={<DraftDetail />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;