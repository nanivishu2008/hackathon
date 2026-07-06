import { GoogleGenerativeAI } from '@google/generative-ai';
import KnowledgeBase from '../models/KnowledgeBase.js';
import Ticket from '../models/Ticket.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Advanced AI Service with Agent Capabilities

export const generateAIResponse = async (userMessage, chatHistory = [], knowledgeContext = '') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const conversationHistory = chatHistory.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const systemPrompt = knowledgeContext
      ? `You are a professional customer support assistant. Use the following knowledge base to answer questions:\n\n${knowledgeContext}\n\nBe concise, helpful, and professional. If uncertain, acknowledge the limitation.`
      : 'You are a professional customer support assistant. Provide accurate, concise, and helpful responses. If uncertain, acknowledge the limitation.';

    const chat = model.startChat({
      history: conversationHistory.slice(-10),
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    // Calculate confidence score
    const confidence = calculateConfidence(userMessage, text, knowledgeContext);

    return {
      response: text,
      confidence,
      intent: detectIntent(userMessage),
      requiresEscalation: confidence < 0.6,
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw { status: 500, message: 'Failed to generate response' };
  }
};

// Intent Detection
export const detectIntent = (message) => {
  const intents = {
    faq: ['how', 'what', 'when', 'where', 'why', 'help', 'guide'],
    bug: ['broken', 'error', 'crash', 'bug', 'issue', 'problem', 'not working'],
    feature: ['can i', 'feature', 'request', 'add', 'support', 'implement'],
    billing: ['charge', 'billing', 'invoice', 'payment', 'price', 'cost'],
    technical: ['install', 'setup', 'configure', 'api', 'sdk', 'integration'],
  };

  const lowerMessage = message.toLowerCase();
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some((kw) => lowerMessage.includes(kw))) {
      return intent;
    }
  }
  return 'general';
};

// Confidence Calculation
export const calculateConfidence = (userMessage, response, context) => {
  let confidence = 0.7; // Base score

  // Increase confidence if context is available
  if (context && context.length > 100) confidence += 0.15;

  // Decrease if message is very short or vague
  if (userMessage.length < 10) confidence -= 0.1;

  // Decrease if response contains uncertainty words
  const uncertaintyWords = ['might', 'maybe', 'possibly', 'unclear', 'unsure'];
  const hasUncertainty = uncertaintyWords.some((word) => response.toLowerCase().includes(word));
  if (hasUncertainty) confidence -= 0.2;

  // Ensure confidence is between 0 and 1
  return Math.max(0, Math.min(1, confidence));
};

// Sentiment Analysis
export const analyzeSentiment = async (text) => {
  const sentimentKeywords = {
    positive: ['great', 'good', 'excellent', 'happy', 'thank', 'appreciate', 'love'],
    negative: ['bad', 'terrible', 'angry', 'frustrated', 'hate', 'awful', 'worst'],
    neutral: [],
  };

  const lowerText = text.toLowerCase();

  let positiveCount = sentimentKeywords.positive.filter((word) => lowerText.includes(word)).length;
  let negativeCount = sentimentKeywords.negative.filter((word) => lowerText.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// Knowledge Base Search
export const searchKnowledgeBase = async (query, limit = 5) => {
  try {
    const results = await KnowledgeBase.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit);

    return results;
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    return [];
  }
};

// Format Knowledge Context
export const formatKnowledgeContext = (documents) => {
  if (!documents || documents.length === 0) return '';

  return documents
    .map((doc) => `Title: ${doc.title}\nCategory: ${doc.category}\nContent: ${doc.content.substring(0, 500)}...`)
    .join('\n\n---\n\n');
};

// Agent: Auto-Escalation
export const handleAutoEscalation = async (chatId, userId, userMessage, confidence) => {
  if (confidence < 0.6) {
    const ticketId = `TICKET-${Date.now()}`;
    const ticket = new Ticket({
      ticketId,
      chatId,
      userId,
      title: `Auto-escalated: ${userMessage.substring(0, 50)}...`,
      description: `Low confidence AI response (${(confidence * 100).toFixed(0)}%). Requires human review.`,
      priority: 'high',
      status: 'open',
    });

    await ticket.save();
    console.log(`✅ Ticket created: ${ticketId}`);
    return ticket;
  }
  return null;
};

// Agent: Summary Generation
export const generateChatSummary = async (messages) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const conversationText = messages
      .map((msg) => `${msg.sender}: ${msg.content}`)
      .join('\n');

    const prompt = `Summarize this customer support conversation in 2-3 sentences:\n\n${conversationText}`;

    const result = await model.generateContent(prompt);
    const summary = await result.response;
    return summary.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Summary generation failed';
  }
};

// Agent: Response Validation
export const validateResponse = (response, userMessage) => {
  const validation = {
    hasContent: response.length > 10,
    isRelevant: response.toLowerCase().includes(userMessage.substring(0, 3).toLowerCase()),
    isProfessional: !response.includes('***') && !response.includes('???'),
    isComplete: response.endsWith('.') || response.endsWith('?') || response.endsWith('!'),
  };

  return Object.values(validation).filter((v) => v).length / Object.values(validation).length;
};

// Agent: Contextual Decision Making
export const makeContextualDecision = (intent, confidence, sentiment) => {
  const decision = {
    shouldRespond: true,
    shouldEscalate: confidence < 0.6,
    shouldLog: true,
    priority: 'medium',
  };

  // Adjust based on sentiment
  if (sentiment === 'negative') {
    decision.priority = 'high';
    if (confidence < 0.7) decision.shouldEscalate = true;
  }

  // Adjust based on intent
  if (intent === 'bug' || intent === 'billing') {
    decision.priority = 'high';
    if (confidence < 0.7) decision.shouldEscalate = true;
  }

  return decision;
};
