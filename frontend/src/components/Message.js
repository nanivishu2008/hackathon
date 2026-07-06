import React from 'react';
import { formatTime } from '../utils/helpers';

const Message = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 message-enter`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <div className="flex items-center justify-between mt-1 gap-2">
          <span className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-600'}`}>
            {formatTime(message.timestamp)}
          </span>
          {message.confidence && (
            <span className="text-xs bg-opacity-30 px-2 py-0.5 rounded bg-white">
              {Math.round(message.confidence * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
