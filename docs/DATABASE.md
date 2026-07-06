# Database Schema Design

## Database: MongoDB

### Collections Overview

| Collection | Purpose | Indexes |
|-----------|---------|---------|
| Users | Store user accounts | email (unique), userId |
| Chats | Store conversations | userId, chatId, lastMessage |
| KnowledgeBase | Store documents | docId, title (text), tags |
| Tickets | Support tickets | ticketId, userId, status |
| Analytics | Store metrics | date, timestamp |

---

## Detailed Schema

### 1. Users Collection

**Purpose**: Store user account information

```mongodb
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "firstName", "lastName", "role"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { 
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        password: { bsonType: "string" },
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        role: { 
          enum: ["user", "admin", "support"],
          description: "User role"
        },
        avatar: { bsonType: "string" },
        department: { bsonType: "string" },
        isActive: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })
```

**Example Document**:
```json
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "password": "$2b$10$...", // bcrypt hash
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "avatar": "https://...",
  "department": "Sales",
  "isActive": true,
  "createdAt": ISODate("2026-07-06"),
  "updatedAt": ISODate("2026-07-06")
}
```

---

### 2. Chats Collection

**Purpose**: Store conversations and message history

```mongodb
db.createCollection("chats", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "messages", "status"],
      properties: {
        _id: { bsonType: "objectId" },
        chatId: { bsonType: "string" },
        userId: { bsonType: "objectId" },
        title: { bsonType: "string" },
        messages: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              messageId: { bsonType: "string" },
              sender: { enum: ["user", "ai"] },
              content: { bsonType: "string" },
              timestamp: { bsonType: "date" },
              confidence: { 
                bsonType: "double",
                minimum: 0,
                maximum: 1
              }
            }
          }
        },
        status: { enum: ["active", "archived", "closed"] },
        resolvedBy: { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        lastMessage: { bsonType: "date" }
      }
    }
  }
})

db.chats.createIndex({ userId: 1, createdAt: -1 })
db.chats.createIndex({ chatId: 1 }, { unique: true })
db.chats.createIndex({ lastMessage: -1 })
db.chats.createIndex({ status: 1 })
```

**Example Document**:
```json
{
  "_id": ObjectId("..."),
  "chatId": "chat_123456",
  "userId": ObjectId("..."),
  "title": "Product Inquiry",
  "messages": [
    {
      "messageId": "msg_1",
      "sender": "user",
      "content": "How do I use feature X?",
      "timestamp": ISODate("2026-07-06T10:00:00Z"),
      "confidence": null
    },
    {
      "messageId": "msg_2",
      "sender": "ai",
      "content": "Feature X allows you to...",
      "timestamp": ISODate("2026-07-06T10:00:05Z"),
      "confidence": 0.95
    }
  ],
  "status": "active",
  "resolvedBy": null,
  "createdAt": ISODate("2026-07-06"),
  "updatedAt": ISODate("2026-07-06"),
  "lastMessage": ISODate("2026-07-06T10:00:05Z")
}
```

---

### 3. KnowledgeBase Collection

**Purpose**: Store company documents and FAQs

```mongodb
db.createCollection("knowledgebase", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["docId", "title", "content", "uploadedBy"],
      properties: {
        _id: { bsonType: "objectId" },
        docId: { bsonType: "string" },
        title: { bsonType: "string" },
        content: { bsonType: "string" },
        fileName: { bsonType: "string" },
        fileType: { enum: ["pdf", "txt", "docx"] },
        uploadedBy: { bsonType: "objectId" },
        category: { bsonType: "string" },
        tags: { 
          bsonType: "array",
          items: { bsonType: "string" }
        },
        searchIndex: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

// Create text index for full-text search
db.knowledgebase.createIndex({ 
  title: "text", 
  content: "text", 
  tags: "text",
  category: "text"
})

db.knowledgebase.createIndex({ docId: 1 }, { unique: true })
db.knowledgebase.createIndex({ uploadedBy: 1 })
db.knowledgebase.createIndex({ category: 1 })
db.knowledgebase.createIndex({ tags: 1 })
```

**Example Document**:
```json
{
  "_id": ObjectId("..."),
  "docId": "doc_789",
  "title": "Getting Started with Platform X",
  "content": "This guide covers basic setup and configuration...",
  "fileName": "getting-started.pdf",
  "fileType": "pdf",
  "uploadedBy": ObjectId("..."),
  "category": "Onboarding",
  "tags": ["setup", "tutorial", "beginner"],
  "searchIndex": "getting started platform setup",
  "createdAt": ISODate("2026-07-06"),
  "updatedAt": ISODate("2026-07-06")
}
```

---

### 4. Tickets Collection

**Purpose**: Store support tickets created by agents

```mongodb
db.createCollection("tickets", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ticketId", "userId", "title", "status", "priority"],
      properties: {
        _id: { bsonType: "objectId" },
        ticketId: { bsonType: "string" },
        chatId: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        status: { enum: ["open", "in-progress", "closed", "resolved"] },
        priority: { enum: ["low", "medium", "high", "urgent"] },
        assignedTo: { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
})

db.tickets.createIndex({ ticketId: 1 }, { unique: true })
db.tickets.createIndex({ userId: 1 })
db.tickets.createIndex({ status: 1, priority: 1 })
db.tickets.createIndex({ createdAt: -1 })
```

**Example Document**:
```json
{
  "_id": ObjectId("..."),
  "ticketId": "TICKET-001",
  "chatId": ObjectId("..."),
  "userId": ObjectId("..."),
  "title": "Cannot reset password",
  "description": "User unable to reset their password via email link",
  "status": "in-progress",
  "priority": "high",
  "assignedTo": ObjectId("..."),
  "createdAt": ISODate("2026-07-06"),
  "updatedAt": ISODate("2026-07-06")
}
```

---

### 5. Analytics Collection

**Purpose**: Store metrics and analytics data

```mongodb
db.createCollection("analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["date"],
      properties: {
        _id: { bsonType: "objectId" },
        date: { bsonType: "date" },
        totalUsers: { bsonType: "int" },
        activeUsers: { bsonType: "int" },
        totalChats: { bsonType: "int" },
        totalMessages: { bsonType: "int" },
        avgResponseTime: { bsonType: "double" },
        satisfactionScore: { 
          bsonType: "double",
          minimum: 0,
          maximum: 5
        },
        resolvedChats: { bsonType: "int" },
        escalatedChats: { bsonType: "int" },
        topicTrends: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
})

db.analytics.createIndex({ date: -1 })
db.analytics.createIndex({ timestamp: -1 })
```

**Example Document**:
```json
{
  "_id": ObjectId("..."),
  "date": ISODate("2026-07-06"),
  "totalUsers": 1250,
  "activeUsers": 340,
  "totalChats": 4521,
  "totalMessages": 18450,
  "avgResponseTime": 2350,
  "satisfactionScore": 4.2,
  "resolvedChats": 3890,
  "escalatedChats": 631,
  "topicTrends": ["product pricing", "technical support", "billing"],
  "timestamp": ISODate("2026-07-06T23:59:59Z")
}
```

---

## Indexing Strategy

### Primary Indexes (Performance)
- Users: `{ email: 1 }`
- Chats: `{ userId: 1, createdAt: -1 }`
- KnowledgeBase: `{ title: "text", content: "text" }`
- Tickets: `{ status: 1, priority: 1 }`
- Analytics: `{ date: -1 }`

### Secondary Indexes (Search)
- Chats: `{ chatId: 1 }`, `{ lastMessage: -1 }`
- KnowledgeBase: `{ category: 1 }`, `{ tags: 1 }`
- Tickets: `{ userId: 1 }`, `{ createdAt: -1 }`

### TTL (Time-To-Live) Indexes
```mongodb
// Optional: Auto-delete old analytics after 1 year
db.analytics.createIndex({ timestamp: 1 }, { expireAfterSeconds: 31536000 })
```

---

## Query Examples

### Find user chats
```mongodb
db.chats.find({ userId: ObjectId("..."), status: "active" })
  .sort({ lastMessage: -1 })
```

### Search knowledge base
```mongodb
db.knowledgebase.find(
  { $text: { $search: "password reset" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
```

### Get daily analytics
```mongodb
db.analytics.findOne({ date: ISODate("2026-07-06") })
```

### Find escalated tickets
```mongodb
db.tickets.find({ status: "open", priority: "high" })
  .sort({ createdAt: 1 })
```

---

**Database Design Status**: ✅ Complete
