import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import KnowledgeUploadPage from './pages/KnowledgeUploadPage';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {user && <Sidebar />}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={user ? <Navigate to="/chat" /> : <LoginPage />} />
              <Route path="/register" element={user ? <Navigate to="/chat" /> : <RegisterPage />} />

              {/* Protected Routes */}
              <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
              <Route path="/chat/:chatId" element={user ? <ChatPage /> : <Navigate to="/login" />} />
              <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
              <Route path="/analytics" element={user ? <AnalyticsPage /> : <Navigate to="/login" />} />
              <Route path="/upload" element={user ? <KnowledgeUploadPage /> : <Navigate to="/login" />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
