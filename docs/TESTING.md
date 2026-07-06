# Testing Guide

## Unit Testing

### Setup

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Test Structure

```javascript
// Example: chatService.test.js
import { createChat, addMessageToChat } from '../services/chatService';
import Chat from '../models/Chat';

jest.mock('../models/Chat');

describe('Chat Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should create a new chat', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const mockChat = {
      _id: '507f1f77bcf86cd799439012',
      chatId: 'chat_123',
      userId,
      save: jest.fn(),
    };

    Chat.mockImplementation(() => mockChat);

    const result = await createChat(userId, 'Test Chat');
    expect(result.title).toBe('Test Chat');
    expect(mockChat.save).toHaveBeenCalled();
  });

  test('Should add message to chat', async () => {
    const mockChat = {
      messages: [],
      save: jest.fn(),
    };

    Chat.findOne = jest.fn().mockResolvedValue(mockChat);

    const result = await addMessageToChat('chat_123', 'user', 'Hello');
    expect(mockChat.messages).toHaveLength(1);
  });
});
```

## Integration Testing

### Backend Tests

```javascript
// tests/api.test.js
import request from 'supertest';
import app from '../server';
import User from '../models/User';

describe('API Integration Tests', () => {
  // Auth Tests
  describe('POST /auth/register', () => {
    test('Should register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    test('Should not register duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });

      // Try to register same email
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain('already exists');
    });
  });

  // Chat Tests
  describe('POST /chat/send-message', () => {
    test('Should send message and get response', async () => {
      // Register user
      const authResponse = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });

      const token = authResponse.body.token;

      // Create chat
      const chatResponse = await request(app)
        .post('/chat/create')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Chat' });

      const chatId = chatResponse.body.chatId;

      // Send message
      const response = await request(app)
        .post('/chat/send-message')
        .set('Authorization', `Bearer ${token}`)
        .send({
          chatId,
          content: 'How do I reset my password?',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.response).toBeDefined();
      expect(response.body.confidence).toBeGreaterThan(0);
      expect(response.body.confidence).toBeLessThanOrEqual(1);
    });
  });
});
```

## Frontend Tests

### Component Tests

```javascript
// src/__tests__/components/ChatInput.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from '../../components/ChatInput';

describe('ChatInput Component', () => {
  test('Should render input field', () => {
    const mockSend = jest.fn();
    render(<ChatInput onSendMessage={mockSend} isLoading={false} />);

    const input = screen.getByPlaceholderText('Type your message...');
    expect(input).toBeInTheDocument();
  });

  test('Should send message on submit', () => {
    const mockSend = jest.fn();
    render(<ChatInput onSendMessage={mockSend} isLoading={false} />);

    const input = screen.getByPlaceholderText('Type your message...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);

    expect(mockSend).toHaveBeenCalledWith('Test message');
  });

  test('Should disable send button when loading', () => {
    render(<ChatInput onSendMessage={jest.fn()} isLoading={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

### Page Tests

```javascript
// src/__tests__/pages/LoginPage.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from '../../pages/LoginPage';

describe('LoginPage', () => {
  test('Should render login form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument();
  });

  test('Should submit form with valid data', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Assert form was submitted
  });
});
```

## E2E Testing

### User Workflows

```gherkin
# tests/features/chat.feature
Feature: Customer Chat Support

  Scenario: User can chat with AI assistant
    Given I am logged in
    When I send a message "How do I reset my password?"
    Then I should see an AI response
    And the response should have a confidence score

  Scenario: Low confidence response triggers escalation
    Given I am logged in
    And I send an obscure question
    When the AI confidence score is below 0.6
    Then a support ticket should be created
    And support team should be notified

  Scenario: User can upload documents
    Given I am logged in
    When I upload a PDF document
    Then the document should be added to knowledge base
    And the AI should use it in responses
```

## Performance Testing

### Load Testing

```javascript
// tests/load.test.js
const autocannon = require('autocannon');

const run = (baseUrl) => {
  return autocannon(
    {
      url: baseUrl,
      connections: 10,
      pipelining: 1,
      duration: 30,
      requests: [
        {
          path: '/health',
          method: 'GET',
        },
      ],
    },
    (err, result) => {
      if (err) {
        throw err;
      }
      console.log('Results:', result);
    }
  );
};

run('http://localhost:5000');
```

## Security Testing

### Authentication

```javascript
test('Should reject request without token', async () => {
  const response = await request(app)
    .get('/chat/all')
    .send();

  expect(response.statusCode).toBe(401);
});

test('Should reject request with invalid token', async () => {
  const response = await request(app)
    .get('/chat/all')
    .set('Authorization', 'Bearer invalid_token')
    .send();

  expect(response.statusCode).toBe(401);
});
```

### Input Validation

```javascript
test('Should sanitize user input', async () => {
  const response = await request(app)
    .post('/auth/register')
    .send({
      email: '<script>alert("xss")</script>',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });

  expect(response.statusCode).toBe(400);
});
```

## Test Coverage

### Generate Coverage Report

```bash
npm test -- --coverage
```

### Expected Coverage
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## Running Tests

```bash
# All tests
npm test

# Specific test file
npm test -- authController.test.js

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# CI mode
npm test -- --ci --coverage
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

---

**Testing Guide Status**: ✅ Complete
**Code Coverage Target**: 80%+
