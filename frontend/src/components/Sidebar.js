import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { FiMessageSquare, FiUploadCloud, FiBarChart, FiHome, FiPlus, FiTrash2 } from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user, location.pathname]); // Reload when user changes or route changes (e.g. after starting a new chat)

  const loadChats = async () => {
    try {
      const response = await chatAPI.getAllChats();
      setChats(response.data || []);
    } catch (err) {
      console.error('Error loading chats in sidebar:', err);
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat session?')) {
      try {
        await chatAPI.deleteChat(chatId);
        setChats(chats.filter((c) => c.chatId !== chatId));
        if (location.pathname.includes(chatId)) {
          navigate('/chat');
        }
      } catch (err) {
        console.error('Error deleting chat:', err);
      }
    }
  };

  if (!user) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/upload', label: 'Upload Docs', icon: FiUploadCloud },
    { path: '/analytics', label: 'Analytics', icon: FiBarChart },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-col h-full border-r border-gray-800">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-blue-400">AI Support</h2>
      </div>

      {/* Main Navigation */}
      <nav className="px-4 py-4 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col px-4 min-h-0">
        <div className="flex items-center justify-between py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <span>Recent Chats</span>
          <button
            onClick={() => navigate('/chat')}
            className="p-1 text-gray-400 hover:text-white rounded hover:bg-gray-800 transition"
            title="Start New Chat"
          >
            <FiPlus size={16} />
          </button>
        </div>

        <button
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 w-full px-4 py-2.5 mb-2 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg text-sm font-medium transition text-left"
        >
          <FiPlus size={18} />
          <span>New Chat</span>
        </button>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 pb-4">
          {chats.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">No recent chats</p>
          ) : (
            chats.map((chat) => {
              const isActive = location.pathname.includes(chat.chatId);
              return (
                <div
                  key={chat.chatId}
                  onClick={() => navigate(`/chat/${chat.chatId}`)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition text-sm ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <FiMessageSquare size={16} className={isActive ? 'text-blue-400' : 'text-gray-500'} />
                    <span className="truncate" title={chat.title}>
                      {chat.title || 'New Chat'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(e, chat.chatId)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 rounded hover:bg-gray-700 transition"
                    title="Delete Chat"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
        <p>© 2026 AI Support</p>
      </div>
    </aside>
  );
};

export default Sidebar;
