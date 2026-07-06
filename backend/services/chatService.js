import Chat from '../models/Chat.js';
import Ticket from '../models/Ticket.js';

export const createChat = async (userId, title = 'New Chat', customChatId = null) => {
  const chatId = customChatId || `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const chat = new Chat({
    chatId,
    userId,
    title,
    messages: [],
  });

  await chat.save();
  return chat;
};

export const addMessageToChat = async (chatId, sender, content, confidence = null) => {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const chat = await Chat.findOne({ chatId });
  if (!chat) {
    throw { status: 404, message: 'Chat not found' };
  }

  chat.messages.push({
    messageId,
    sender,
    content,
    timestamp: new Date(),
    confidence,
  });

  chat.lastMessage = new Date();
  await chat.save();

  return chat;
};

export const getChatHistory = async (chatId) => {
  const chat = await Chat.findOne({ chatId }).populate('userId', 'firstName lastName email');
  if (!chat) {
    throw { status: 404, message: 'Chat not found' };
  }
  return chat;
};

export const getUserChats = async (userId) => {
  const chats = await Chat.find({ userId }).sort({ lastMessage: -1 });
  return chats;
};

export const deleteChat = async (chatId) => {
  const result = await Chat.deleteOne({ chatId });
  if (result.deletedCount === 0) {
    throw { status: 404, message: 'Chat not found' };
  }
  return result;
};

export const createEscalationTicket = async (chatId, userId, title, description) => {
  const ticketId = `TICKET-${Date.now()}`;
  const ticket = new Ticket({
    ticketId,
    chatId,
    userId,
    title,
    description,
    priority: 'high',
    status: 'open',
  });

  await ticket.save();
  return ticket;
};
