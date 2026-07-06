# API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Logout
**POST** `/auth/logout`

Logout user (invalidate token on client side).

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

---

## Chat Endpoints

### 1. Send Message
**POST** `/chat/send-message`

Send a message and get AI response.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "chatId": "chat_1234567890",
  "content": "How do I reset my password?"
}
```

**Response** (200 OK):
```json
{
  "messageId": "msg_1234567890_ai",
  "response": "To reset your password, click on...",
  "confidence": 0.92,
  "timestamp": "2026-07-06T10:00:00Z",
  "chatId": "chat_1234567890"
}
```

**Error Response** (400):
```json
{
  "message": "Message content is required"
}
```

---

### 2. Get Chat History
**GET** `/chat/history/:chatId`

Retrieve all messages in a chat.

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `chatId` (string, required): Chat ID

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "chatId": "chat_1234567890",
  "userId": "507f1f77bcf86cd799439012",
  "title": "Password Reset Help",
  "messages": [
    {
      "messageId": "msg_1",
      "sender": "user",
      "content": "How do I reset my password?",
      "timestamp": "2026-07-06T10:00:00Z",
      "confidence": null
    },
    {
      "messageId": "msg_2",
      "sender": "ai",
      "content": "To reset your password...",
      "timestamp": "2026-07-06T10:00:05Z",
      "confidence": 0.92
    }
  ],
  "status": "active",
  "createdAt": "2026-07-06T10:00:00Z",
  "updatedAt": "2026-07-06T10:00:05Z"
}
```

---

### 3. Get All Chats
**GET** `/chat/all`

Get all chats for the authenticated user.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "chatId": "chat_1234567890",
    "title": "Password Reset Help",
    "status": "active",
    "lastMessage": "2026-07-06T10:00:05Z",
    "createdAt": "2026-07-06T10:00:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "chatId": "chat_0987654321",
    "title": "Billing Question",
    "status": "archived",
    "lastMessage": "2026-07-05T15:00:00Z",
    "createdAt": "2026-07-05T15:00:00Z"
  }
]
```

---

### 4. Create New Chat
**POST** `/chat/create`

Create a new chat session.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body** (optional):
```json
{
  "title": "Billing Support"
}
```

**Response** (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "chatId": "chat_1234567890",
  "userId": "507f1f77bcf86cd799439012",
  "title": "Billing Support",
  "messages": [],
  "status": "active",
  "createdAt": "2026-07-06T10:00:00Z",
  "updatedAt": "2026-07-06T10:00:00Z"
}
```

---

### 5. Delete Chat
**DELETE** `/chat/:chatId`

Delete a chat session.

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `chatId` (string, required): Chat ID to delete

**Response** (200 OK):
```json
{
  "message": "Chat deleted successfully"
}
```

---

## Knowledge Base Endpoints

### 1. Upload Documents
**POST** `/kb/upload`

Upload documents for knowledge base.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data**:
- `files` (file, required): One or more files (PDF, TXT, DOCX)
  - Max file size: 10MB
  - Max files: 5

**cURL Example**:
```bash
curl -X POST http://localhost:5000/kb/upload \
  -H "Authorization: Bearer <token>" \
  -F "files=@document.pdf" \
  -F "files=@guide.docx"
```

**Response** (201 Created):
```json
{
  "message": "2 document(s) uploaded successfully",
  "documents": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "docId": "doc_1234567890",
      "title": "document.pdf",
      "fileName": "document.pdf",
      "fileType": "pdf",
      "category": "General",
      "tags": [],
      "createdAt": "2026-07-06T10:00:00Z"
    }
  ]
}
```

---

### 2. Search Documents
**GET** `/kb/search`

Search knowledge base documents.

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `q` (string, required): Search query

**Example**:
```
GET /kb/search?q=password+reset
```

**Response** (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "docId": "doc_1234567890",
    "title": "Password Reset Guide",
    "content": "To reset your password...",
    "category": "FAQs",
    "tags": ["password", "account", "reset"],
    "createdAt": "2026-07-06T10:00:00Z"
  }
]
```

---

### 3. Get All Documents
**GET** `/kb/all`

Get all uploaded documents.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "docId": "doc_1234567890",
    "title": "Getting Started",
    "fileName": "getting_started.pdf",
    "category": "Onboarding",
    "tags": ["setup", "tutorial"],
    "createdAt": "2026-07-06T10:00:00Z"
  }
]
```

---

### 4. Delete Document
**DELETE** `/kb/:docId`

Delete a document from knowledge base.

**Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
- `docId` (string, required): Document ID (MongoDB _id)

**Response** (200 OK):
```json
{
  "message": "Document deleted successfully"
}
```

---

## Analytics Endpoints

### 1. Get Analytics Summary
**GET** `/analytics/summary`

Get current system analytics and metrics.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "totalUsers": 1250,
  "activeUsers": 340,
  "totalChats": 5678,
  "totalMessages": 18450,
  "avgResponseTime": 2350,
  "satisfactionScore": 4.2,
  "resolvedChats": 4890,
  "escalatedChats": 788,
  "topicTrends": [
    "password reset",
    "technical support",
    "billing inquiry"
  ]
}
```

---

### 2. Get Detailed Analytics
**GET** `/analytics/detailed`

Get detailed historical analytics data.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "date": "2026-07-06T00:00:00Z",
  "totalUsers": 1250,
  "activeUsers": 340,
  "totalChats": 5678,
  "totalMessages": 18450,
  "avgResponseTime": 2350,
  "satisfactionScore": 4.2,
  "resolvedChats": 4890,
  "escalatedChats": 788,
  "topicTrends": ["password reset", "technical support"],
  "createdAt": "2026-07-06T00:00:00Z",
  "updatedAt": "2026-07-06T00:00:00Z"
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request**:
```json
{
  "message": "Validation error message"
}
```

**401 Unauthorized**:
```json
{
  "message": "No token provided" / "Invalid token"
}
```

**404 Not Found**:
```json
{
  "message": "Chat not found" / "Document not found"
}
```

**500 Internal Server Error**:
```json
{
  "message": "Internal server error",
  "error": { ... } // Only in development
}
```

---

## Rate Limiting

- **Free Tier**: 60 requests per minute (Gemini API)
- **Rate limit headers**:
  ```
  X-RateLimit-Limit: 60
  X-RateLimit-Remaining: 59
  X-RateLimit-Reset: 1625574000
  ```

---

## Testing Endpoints

### Health Check
**GET** `/health`

Check server status.

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2026-07-06T10:00:00Z"
}
```

---

## Pagination

For endpoints returning multiple items, use query parameters:
```
GET /chat/all?page=1&limit=10
```

---

**API Version**: 1.0  
**Last Updated**: 2026-07-06
