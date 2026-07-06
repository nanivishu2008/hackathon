import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiArrowRight, FiMessageSquare, FiBarChart, FiUpload } from 'react-icons/fi';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-600">AI Support Assistant</h1>
            <div className="space-x-4">
              {user ? (
                <button
                  onClick={() => navigate('/chat')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to Chat
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Instant AI-Powered Customer Support
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get instant answers from our AI assistant, powered by Gemini API. Search your knowledge base, get context-aware responses, and escalate complex queries to human support.
          </p>
          {!user && (
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold inline-flex items-center gap-2"
            >
              Get Started <FiArrowRight />
            </button>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FiMessageSquare className="text-blue-600" size={24} />
            </div>
            <h4 className="text-xl font-semibold mb-2">AI Chat</h4>
            <p className="text-gray-600">
              Chat with our AI assistant powered by Gemini API for instant answers and solutions.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FiUpload className="text-green-600" size={24} />
            </div>
            <h4 className="text-xl font-semibold mb-2">Document Upload</h4>
            <p className="text-gray-600">
              Upload company documents and FAQs for AI to use as context when answering questions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FiBarChart className="text-purple-600" size={24} />
            </div>
            <h4 className="text-xl font-semibold mb-2">Analytics</h4>
            <p className="text-gray-600">
              Track support metrics, customer satisfaction, and system performance in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-12 mt-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">Ready to improve customer support?</h3>
          <p className="text-lg mb-6">
            Start using AI-powered support today. Reduce response time, improve satisfaction, and scale support effortlessly.
          </p>
          {!user && (
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 text-lg font-semibold"
            >
              Create Account
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 AI Customer Support Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
