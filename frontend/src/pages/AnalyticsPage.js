import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { FiBarChart3, FiAlertCircle } from 'react-icons/fi';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getSummary();
      setAnalytics(response.data);
      setError('');
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">System performance and user metrics</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                <p className="text-gray-600 text-sm font-medium mb-2">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics?.totalUsers || 0}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
                <p className="text-gray-600 text-sm font-medium mb-2">Total Chats</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics?.totalChats || 0}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
                <p className="text-gray-600 text-sm font-medium mb-2">Avg Response Time</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics?.avgResponseTime ? `${analytics.avgResponseTime}ms` : 'N/A'}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
                <p className="text-gray-600 text-sm font-medium mb-2">Satisfaction Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics?.satisfactionScore ? `${analytics.satisfactionScore}/5` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Resolved Chats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Resolved Chats</h3>
                <p className="text-4xl font-bold text-green-600">
                  {analytics?.resolvedChats || 0}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Success rate:{' '}
                  {analytics?.totalChats
                    ? `${((analytics.resolvedChats / analytics.totalChats) * 100).toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>

              {/* Escalated Chats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Escalated Chats</h3>
                <p className="text-4xl font-bold text-orange-600">
                  {analytics?.escalatedChats || 0}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Escalation rate:{' '}
                  {analytics?.totalChats
                    ? `${((analytics.escalatedChats / analytics.totalChats) * 100).toFixed(1)}%`
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Topic Trends */}
            {analytics?.topicTrends && analytics.topicTrends.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Topic Trends</h3>
                <div className="flex flex-wrap gap-2">
                  {analytics.topicTrends.map((topic, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
