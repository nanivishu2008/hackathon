import {
  createChat,
  addMessageToChat,
  getChatHistory,
  getUserChats,
  deleteChat,
  createEscalationTicket,
} from '../services/chatService.js';
import { generateAIResponse, searchKnowledgeBase, formatKnowledgeContext } from '../services/aiService.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Add user message to chat (dynamically create chat if it doesn't exist)
    let chat;
    try {
      chat = await addMessageToChat(chatId, 'user', content);
    } catch (err) {
      if (err.status === 404) {
        const chatTitle = content.length > 30 ? `${content.substring(0, 27)}...` : content;
        await createChat(userId, chatTitle, chatId);
        chat = await addMessageToChat(chatId, 'user', content);
      } else {
        throw err;
      }
    }

    // Search knowledge base for relevant documents
    const knowledgeDocuments = await searchKnowledgeBase(content, 3).catch(() => []);
    const knowledgeContext = formatKnowledgeContext(knowledgeDocuments);

    // Get chat history for context
    const chatHistory = chat.messages.slice(-10); // Last 10 messages

    // Generate AI response
    const { response, confidence } = await generateAIResponse(content, chatHistory, knowledgeContext);

    // Add AI message to chat
    const messageId = `msg_${Date.now()}_ai`;
    chat = await addMessageToChat(chatId, 'ai', response, confidence);

    // Check if escalation is needed (low confidence)
    if (confidence < 0.6) {
      await createEscalationTicket(
        chat._id,
        userId,
        `Low confidence response to: ${content.substring(0, 50)}...`,
        `AI generated response with low confidence (${(confidence * 100).toFixed(0)}%).`
      );
    }

    res.json({
      messageId,
      response,
      confidence,
      timestamp: new Date(),
      chatId: chat.chatId,
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const chat = await getChatHistory(chatId);
    res.json(chat);
  } catch (error) {
    next(error);
  }
};

export const getAllChats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const chats = await getUserChats(userId);
    res.json(chats);
  } catch (error) {
    next(error);
  }
};

export const createNewChat = async (req, res, next) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;
    const chat = await createChat(userId, title);
    res.status(201).json(chat);
  } catch (error) {
    next(error);
  }
};

export const removeChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    await deleteChat(chatId);
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    next(error);
  }
};
