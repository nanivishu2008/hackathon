import { GoogleGenerativeAI } from '@google/generative-ai';
import KnowledgeBase from '../models/KnowledgeBase.js';
import Ticket from '../models/Ticket.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// Helper to provide smart fallback mock responses when Gemini API Key is invalid/default
const getMockResponse = async (userMessage, knowledgeContext = '') => {
  const intent = detectIntent(userMessage);
  const lowerMsg = userMessage.toLowerCase().trim().replace(/[?.,!]/g, '');

  // 1. Check if asking about uploaded documents
  const fileKeywords = ['name of the doc', 'doc i uploaded', 'file i uploaded', 'what document', 'uploaded a pdf', 'which doc', 'uploaded files', 'knowledge base docs'];
  const isAskingAboutFiles = fileKeywords.some(keyword => lowerMsg.includes(keyword));

  if (isAskingAboutFiles) {
    try {
      const docs = await KnowledgeBase.find();
      if (docs.length === 0) {
        return {
          response: "No documents have been uploaded to the knowledge base yet. You can upload documents on the 'Upload Docs' page!",
          confidence: 0.95,
          intent,
          requiresEscalation: false
        };
      }
      const docList = docs.map((d, i) => `${i + 1}. **${d.title}** (${d.fileType})`).join('\n');
      return {
        response: `Yes, you have uploaded the following document(s) to the knowledge base:\n\n${docList}\n\nI can answer questions based on the content of these documents!`,
        confidence: 0.95,
        intent,
        requiresEscalation: false
      };
    } catch (err) {
      console.error('Error fetching docs in mock response:', err);
    }
  }

  // 2. Check if asking for summary
  const summaryKeywords = ['summarise', 'summarize', 'summary', 'about the doc', 'overview of'];
  const isAskingForSummary = summaryKeywords.some(keyword => lowerMsg.includes(keyword));

  if (isAskingForSummary) {
    try {
      const docs = await KnowledgeBase.find();
      if (docs.length === 0) {
        return {
          response: "No documents have been uploaded to the knowledge base yet. Please upload a document first so I can summarize it for you!",
          confidence: 0.95,
          intent,
          requiresEscalation: false
        };
      }
      
      const primaryDoc = docs[0];
      let docSummary = '';
      
      // If content is clean, show preview, otherwise show mock summary
      if (primaryDoc.content && !primaryDoc.content.startsWith('%PDF')) {
        const cleanContent = primaryDoc.content.replace(/\s+/g, ' ').substring(0, 400);
        docSummary = `Here is a summary of the uploaded document (**${primaryDoc.title}**):\n\n"${cleanContent}..."\n\nIt covers key topics related to your queries.`;
      } else {
        docSummary = `Here is an automated summary of the uploaded document (**${primaryDoc.title}**):\n\nThis document provides technical background, system specifications, and reference guidelines. Key sections include introduction, core parameters, architectural details, and implementation procedures. Since the document format is currently indexed as binary, please re-upload the document to get a full text-based analysis!`;
      }

      return {
        response: docSummary,
        confidence: 0.95,
        intent,
        requiresEscalation: false
      };
    } catch (err) {
      console.error('Error summarizing docs in mock response:', err);
    }
  }

  // 3. Fallback to normal paragraph matching if context exists
  if (knowledgeContext && knowledgeContext.length > 0) {
    const paragraphs = knowledgeContext.split('\n');
    let matchedParagraph = '';
    
    for (const para of paragraphs) {
      const cleanPara = para.replace('Content:', '').replace('Title:', '').trim();
      if (cleanPara.length > 20 && !cleanPara.startsWith('%PDF')) {
        const words = lowerMsg.split(/\s+/).filter(w => w.length > 3);
        const matchCount = words.filter(word => cleanPara.toLowerCase().includes(word)).length;
        if (matchCount >= 2) {
          matchedParagraph = cleanPara;
          break;
        }
      }
    }
    
    if (matchedParagraph) {
      return {
        response: `Based on our company documents:\n\n"${matchedParagraph.substring(0, 400)}..."\n\nIs there anything else I can help you with regarding this?`,
        confidence: 0.9,
        intent,
        requiresEscalation: false
      };
    }
  }

  let response = '';
  let confidence = 0.85;
  
  if (lowerMsg === 'hi' || lowerMsg === 'hello' || lowerMsg === 'hey') {
    response = "Hello! I am your AI Customer Support Assistant. How can I help you today?";
  } else if (lowerMsg.includes('how are you')) {
    response = "I'm doing well, thank you for asking! How can I assist you with our services today?";
  } else if (lowerMsg.includes('who are you') || lowerMsg.includes('what is your name') || lowerMsg.includes('your identity')) {
    response = "I am the AI Customer Support Assistant. I can help answer questions, search company documents, or escalate issues to human support.";
  } else if (lowerMsg.includes('thank you') || lowerMsg.includes('thanks')) {
    response = "You're very welcome! Please let me know if there's anything else I can do for you.";
  } else if (intent === 'bug') {
    response = "I'm sorry to hear that you are experiencing an issue. Could you please provide more details or steps to reproduce the error? I have automatically flagged this as a technical bug and escalated it to our support team.";
    confidence = 0.5; // low confidence triggers escalation
  } else if (intent === 'billing') {
    response = "For billing inquiries: standard invoices are processed within 24 hours. If this is an urgent payment issue, please let me know and I will escalate to our accounts team.";
    confidence = 0.55; // triggers escalation
  } else if (intent === 'technical') {
    response = "To assist you with this technical issue, please make sure you've followed the setup guide in the installation documentation. If you still need help, feel free to ask for escalation.";
  } else {
    response = "I understand you have a question. Could you please provide a bit more detail or context so I can search our knowledge base and give you the most accurate answer?";
  }

  return {
    response,
    confidence,
    intent,
    requiresEscalation: confidence < 0.6
  };
};

// Advanced AI Service with Agent Capabilities
export const generateAIResponse = async (userMessage, chatHistory = [], knowledgeContext = '') => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.startsWith('your_')) {
      console.warn('⚠️ Warning: Using mock AI response because GEMINI_API_KEY is not configured.');
      return await getMockResponse(userMessage, knowledgeContext);
    }

    // Using gemini-1.5-flash as the modern model name
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const conversationHistory = chatHistory.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const systemPrompt = knowledgeContext
      ? `You are a professional customer support assistant. Use the following knowledge base to answer questions:\n\n${knowledgeContext}\n\nBe concise, helpful, and professional. If you don't know the answer or if the context doesn't contain it, be honest about it.`
      : "You are a professional customer support assistant. Provide accurate, concise, and helpful responses. If you don't know the answer, be honest about it.";

    const chat = model.startChat({
      history: conversationHistory.slice(-10),
    });

    // Fix: Send the prompt with system instruction and context to the model instead of just userMessage
    const prompt = `${systemPrompt}\n\nCustomer: ${userMessage}`;
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    // Calculate confidence score dynamically
    const confidence = calculateConfidence(userMessage, text, knowledgeContext);

    return {
      response: text,
      confidence,
      intent: detectIntent(userMessage),
      requiresEscalation: confidence < 0.6,
    };
  } catch (error) {
    // If the API call fails due to invalid key or auth, fallback to mock response to prevent crash!
    if (error.message && (error.message.includes('API key') || error.message.includes('API_KEY_INVALID'))) {
      console.warn('⚠️ Warning: Gemini API Call failed due to invalid key. Falling back to mock response.');
      return await getMockResponse(userMessage, knowledgeContext);
    }
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
  const uncertaintyWords = ['might', 'maybe', 'possibly', 'unclear', 'unsure', "don't know", "do not know", "not sure"];
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
    .map((doc) => `Title: ${doc.title}\nCategory: ${doc.category || 'General'}\nContent: ${doc.content.substring(0, 500)}...`)
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
