# Gemini AI Integration Guide

## Overview

This project uses Google's Gemini API for generating AI responses and handling customer support queries. The integration includes context-aware responses, knowledge base retrieval, and confidence scoring.

## Setup

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key and add it to `.env`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

### 2. Install Dependencies

```bash
npm install @google/generative-ai
```

## Features

### Gemini Integration

#### 1. Context-Aware Responses
- Uses conversation history for context
- Retrieves relevant documents from knowledge base
- Provides comprehensive answers based on company information

#### 2. Response Generation
```javascript
import { generateAIResponse } from '../services/aiService.js';

const { response, confidence } = await generateAIResponse(
  userMessage,
  chatHistory,
  knowledgeContext
);
```

#### 3. Knowledge Base Retrieval
- Full-text search of uploaded documents
- Relevance scoring and ranking
- Context formatting for AI prompts

#### 4. Confidence Scoring
- Scores responses 0-1
- Low confidence (< 0.6) triggers escalation
- Helps identify queries needing human support

### Advanced Features

#### Sentiment Analysis (Optional)
```javascript
const sentiment = await analyzeSentiment(userMessage);
// Returns: positive, neutral, negative
```

#### Multi-turn Conversations
- Maintains chat history
- Provides context across multiple messages
- Enables natural conversation flow

#### Response Refinement
- Checks response quality
- Ensures factual accuracy
- Formats responses for user readability

## API Integration

### Model Used
- **Model**: `gemini-pro`
- **Temperature**: 0.7 (balanced creativity and accuracy)
- **Max Tokens**: 2048 (configurable)

### Request/Response Format

**Request**:
```json
{
  "message": "How do I reset my password?",
  "chatHistory": [
    { "sender": "user", "content": "Hi" },
    { "sender": "ai", "content": "Hello! How can I help?" }
  ]
}
```

**Response**:
```json
{
  "response": "To reset your password...",
  "confidence": 0.92,
  "sources": ["doc_123", "doc_456"],
  "timestamp": "2026-07-06T10:00:00Z"
}
```

## Best Practices

### 1. Prompt Engineering
- Keep prompts clear and concise
- Include company knowledge context
- Specify response format requirements

### 2. Rate Limiting
- Implement request throttling
- Cache common responses
- Monitor API usage

### 3. Error Handling
```javascript
try {
  const response = await generateAIResponse(message, history, context);
} catch (error) {
  if (error.status === 429) {
    // Rate limited - retry later
  } else if (error.status === 401) {
    // Invalid API key
  }
}
```

### 4. Performance Optimization
- Limit chat history to last 10 messages
- Use streaming for long responses
- Cache knowledge base searches

## Configuration Options

### Response Settings
```javascript
// In aiService.js
const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2048,
    topP: 0.95,
    topK: 40,
  },
});
```

### Knowledge Base Context
```javascript
// Customize context inclusion
const knowledgeContext = formatKnowledgeContext(documents);
// Returns formatted string for prompt inclusion
```

## Troubleshooting

### Common Issues

#### 1. Invalid API Key
- Check `.env` file for correct key
- Verify key is active in Google AI Studio
- Regenerate key if needed

#### 2. Rate Limiting (429 Error)
- Implement exponential backoff
- Cache responses
- Reduce request frequency

#### 3. Poor Response Quality
- Improve knowledge base documents
- Refine prompt templates
- Adjust temperature setting
- Add more context

#### 4. Timeout Issues
- Increase timeout threshold
- Implement request queuing
- Use streaming responses

## Monitoring & Logging

### Log Response Quality
```javascript
console.log({
  message: userMessage,
  confidence: response.confidence,
  responseTime: Date.now() - startTime,
  sources: relevantDocuments.map(d => d.docId),
});
```

### Track Metrics
- Average response time
- Confidence score distribution
- Escalation rate
- User satisfaction

## Cost Optimization

### Free Tier Limits
- 60 requests per minute
- No monthly limit on free tier
- Generous rate limits for testing

### Cost Estimation
- Price per 1M input tokens: varies
- Price per 1M output tokens: varies
- Check [pricing page](https://ai.google.dev/pricing) for current rates

## Advanced Techniques

### 1. Prompt Caching (Coming Soon)
- Cache frequently used contexts
- Reduce token usage
- Faster responses

### 2. Multi-Model Approach
- Use different models for different tasks
- Gemini for general queries
- Specialized models for specific domains

### 3. Response Streaming
```javascript
// For long responses
const response = await model.generateContentStream(prompt);
for await (const chunk of response.stream) {
  // Handle streaming chunks
}
```

## Resources

- [Google Generative AI SDK](https://github.com/google/generative-ai-js)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Model Documentation](https://ai.google.dev/models/gemini-pro)
- [API Reference](https://ai.google.dev/api/reference)

---

**Phase 5 Status**: ✅ Complete
**Next Phase**: Intelligent Agent Features (Phase 6)
