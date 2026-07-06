import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import Message from '../components/Message';
import ChatInput from '../components/ChatInput';
import { FiMessageSquare, FiAlertCircle } from 'react-icons/fi';

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentChatId, setCurrentChatId] = useState(chatId || `chat_${Date.now()}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history if chatId exists, otherwise reset chat state
  useEffect(() => {
    if (chatId) {
      setCurrentChatId(chatId);
      loadChatHistory();
    } else {
      setCurrentChatId(`chat_${Date.now()}`);
      setMessages([]);
      setError('');
    }
  }, [chatId]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getHistory(chatId);
      setMessages(response.data.messages || []);
      setError('');
    } catch (err) {
      console.error('Error loading chat history:', err);
      setError('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    // Add user message immediately
    const userMessage = {
      messageId: `msg_${Date.now()}_user`,
      sender: 'user',
      content,
      timestamp: new Date(),
      confidence: null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setError('');
    setLoading(true);

    try {
      // Send message to backend
      const response = await chatAPI.sendMessage(currentChatId, content);
      
      // Add AI response
      const aiMessage = {
        messageId: response.data.messageId || `msg_${Date.now()}_ai`,
        sender: 'ai',
        content: response.data.response,
        timestamp: new Date(response.data.timestamp),
        confidence: response.data.confidence,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Update chatId if new chat
      if (!chatId) {
        const newId = response.data.chatId || currentChatId;
        setCurrentChatId(newId);
        navigate(`/chat/${newId}`, { replace: true });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send message. Please try again.';
      setError(errorMessage);

      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 md:ml-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <FiMessageSquare className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Chat Assistant</h2>
            <p className="text-sm text-gray-600">Chat ID: {currentChatId.substring(0, 12)}...</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && !error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FiMessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 text-lg">Start a conversation</p>
              <p className="text-gray-400 text-sm">Type a message to begin chatting with AI</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {messages.map((message) => (
          <Message
            key={message.messageId}
            message={message}
            isUser={message.sender === 'user'}
          />
        ))}

        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={loading} />
    </div>
  );
};

export default ChatPage;
