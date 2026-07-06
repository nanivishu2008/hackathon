import React from 'react';
import { FiUsers, FiMessageSquare, FiTrendingUp, FiSmile } from 'react-icons/fi';

const DashboardPage = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: FiUsers,
      color: 'blue',
      trend: '+12% from last month',
    },
    {
      title: 'Total Chats',
      value: '5,678',
      icon: FiMessageSquare,
      color: 'green',
      trend: '+23% from last month',
    },
    {
      title: 'Avg Response Time',
      value: '2.3s',
      icon: FiTrendingUp,
      color: 'purple',
      trend: '-15% from last month',
    },
    {
      title: 'Satisfaction Score',
      value: '4.5/5',
      icon: FiSmile,
      color: 'yellow',
      trend: '+5% from last month',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your support system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 border-blue-200',
              green: 'bg-green-50 text-green-600 border-green-200',
              purple: 'bg-purple-50 text-purple-600 border-purple-200',
              yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
            };

            return (
              <div key={stat.title} className={`bg-white rounded-lg shadow-md p-6 border ${colorClasses[stat.color]}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon size={24} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.trend}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Chat Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border-l-4 border-blue-600 pl-4 py-2">
                    <p className="font-semibold text-gray-900">User {i} asked a question</p>
                    <p className="text-sm text-gray-600">2 minutes ago</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                Start New Chat
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                Upload Documents
              </button>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
