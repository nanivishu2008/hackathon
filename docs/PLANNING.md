# Phase 1-2: Planning & System Design

## Phase 1: Define Features (Days 1-2)

### Core Features

#### 1. User Authentication
- User registration with email
- Login/Logout functionality
- Password hashing & security
- JWT token generation
- Role-based access (User/Admin)

#### 2. AI Chatbot Interface
- Real-time chat messaging
- Message input/output
- Message history display
- Typing indicators
- Read receipts

#### 3. Knowledge Base Management
- Upload documents (PDF, TXT, DOCX)
- Parse and store document content
- Index documents for search
- Delete documents
- Document versioning

#### 4. Document Search
- Full-text search across documents
- Relevance scoring
- Filter by document type
- Search history

#### 5. AI-Generated Responses
- Gemini API integration
- Context-aware responses
- Confidence scoring
- Response quality metrics

#### 6. Conversation History
- Store all conversations
- Retrieve chat history
- Export conversations
- Archive old chats

#### 7. Admin Dashboard
- User management
- Document management
- Chat monitoring
- System settings

#### 8. Analytics Panel
- Total users count
- Total chats count
- Average response time
- Customer satisfaction score
- Chat response trends
- Peak usage times
- User engagement metrics

### Feature Prioritization
**MVP (Must Have)**:
- Authentication, Chat, Knowledge Base, Search, AI Responses

**High Priority**:
- Conversation History, Analytics

**Phase 2**:
- Admin Dashboard, Intelligent Agents, Advanced Features

---

## Phase 2: Technology Stack Selection (Day 3)

### Frontend Stack
✅ **React.js** - Component-based UI framework
✅ **Tailwind CSS** - Utility-first CSS framework
✅ **Axios** - HTTP client for API calls
✅ **React Router** - Client-side routing
✅ **Redux/Context API** - State management
✅ **React Hooks** - Functional components

### Backend Stack
✅ **Node.js** - Runtime environment
✅ **Express.js** - Web framework
✅ **MongoDB** - NoSQL database
✅ **Mongoose** - ODM for MongoDB
✅ **JWT** - Authentication
✅ **Bcryptjs** - Password hashing
✅ **Multer** - File upload handling
✅ **Cors** - Cross-origin resource sharing

### AI Integration
✅ **Google Gemini API** - AI response generation
✅ **LangChain.js** - LLM orchestration (optional)

### Tools & Utilities
✅ **Dotenv** - Environment variables
✅ **Jest** - Testing framework
✅ **Postman** - API testing
✅ **VS Code** - Code editor

### Deployment
✅ **MongoDB Atlas** - Cloud database
✅ **Vercel** - Frontend hosting
✅ **Render/Railway** - Backend hosting

---

## Phase 3: System Design (Day 3)

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │ Chat Page    │ Auth Page    │ Dashboard/Analytics      │ │
│  │ Upload Page  │ Knowledge KB │ Admin Panel              │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │ Axios HTTP
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Routes: Auth, Chat, KB, Analytics                       │ │
│  │ Controllers: Handle business logic                      │ │
│  │ Middleware: JWT Auth, Error Handling                    │ │
│  │ Services: DB Ops, AI Integration                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    ┌─────────┐    ┌──────────────┐  ┌──────────────┐
    │ MongoDB │    │ Gemini API   │  │ File Storage │
    │ Database│    │ (AI Responses)│  │ (Uploads)    │
    └─────────┘    └──────────────┘  └──────────────┘
```

### Data Flow

```
User Input
  ├─ Authentication Request
  │  └─> Auth Service → JWT Token → User Authenticated
  │
  ├─ Chat Message
  │  └─> Chat Controller
  │      ├─> Save to Database
  │      ├─> Extract Keywords
  │      ├─> Search Knowledge Base
  │      ├─> Call Gemini API with Context
  │      └─> Return Response → Client
  │
  ├─ Document Upload
  │  └─> Upload Controller
  │      ├─> Save File
  │      ├─> Parse Content
  │      ├─> Index in MongoDB
  │      └─> Confirm Upload
  │
  └─ Search Query
     └─> Search Service
         ├─> MongoDB Full-Text Search
         ├─> Rank Results by Relevance
         └─> Return Top Results
```

### User Flow

```
┌─────────────────────────────────────────┐
│       Visitor                           │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼──────┐
        │  Register   │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │    Login    │
        └──────┬──────┘
               │
       ┌───────▼───────────────────┐
       │   Authenticated User      │
       │                           │
       ├─► Chat Interface          │
       │   ├─ Ask Question         │
       │   ├─ Get AI Response      │
       │   └─ View History         │
       │                           │
       ├─► Upload Documents        │
       │   ├─ Select Files         │
       │   └─ Confirm Upload       │
       │                           │
       └─► View Dashboard          │
           ├─ Analytics            │
           └─ Chat Stats           │
```

### API Flow

```
Client Request (Chat Message)
  │
  ▼
Express Router
  │
  ▼
Authentication Middleware (JWT Verification)
  │
  ▼
Chat Controller
  ├─► Save message to Database
  ├─► Extract Keywords
  │
  ▼
Knowledge Service (Search Documents)
  ├─► Query MongoDB
  └─► Get Relevant Documents
  │
  ▼
Gemini Service (Generate Response)
  ├─► Call Gemini API
  ├─► Add Context from KB
  └─► Get Response
  │
  ▼
Response Formatter
  │
  ▼
Send Response to Client
```

---

## Database Collections Schema

### Users
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (user/admin/support),
  avatar: String (URL),
  department: String,
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}
```

### Chats
```javascript
{
  _id: ObjectId,
  chatId: String (unique),
  userId: ObjectId (ref: Users),
  title: String,
  messages: [{
    messageId: String,
    sender: String (user/ai),
    content: String,
    timestamp: Date,
    confidence: Number (0-1)
  }],
  status: String (active/archived/closed),
  resolvedBy: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date,
  lastMessage: Date
}
```

### KnowledgeBase
```javascript
{
  _id: ObjectId,
  docId: String (unique),
  title: String,
  content: String,
  fileName: String,
  fileType: String (pdf/txt/docx),
  uploadedBy: ObjectId (ref: Users),
  category: String,
  tags: [String],
  searchIndex: String (full-text index),
  createdAt: Date,
  updatedAt: Date
}
```

### Tickets
```javascript
{
  _id: ObjectId,
  ticketId: String (unique),
  chatId: ObjectId (ref: Chats),
  userId: ObjectId (ref: Users),
  title: String,
  description: String,
  status: String (open/in-progress/closed),
  priority: String (low/medium/high/urgent),
  assignedTo: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics
```javascript
{
  _id: ObjectId,
  date: Date,
  totalUsers: Number,
  activeUsers: Number,
  totalChats: Number,
  totalMessages: Number,
  avgResponseTime: Number (ms),
  satisfactionScore: Number (0-5),
  resolvedChats: Number,
  escalatedChats: Number,
  topicTrends: [String],
  timestamp: Date
}
```

---

## Environment Setup Checklist

- [ ] Create `.env` file in backend directory
- [ ] Create `.env.local` file in frontend directory
- [ ] Install Node.js and npm
- [ ] Create MongoDB Atlas account and cluster
- [ ] Get Gemini API key from Google AI Studio
- [ ] Generate JWT secret
- [ ] Set up Git repository
- [ ] Create project directory structure
- [ ] Initialize npm projects (frontend & backend)

---

**Phase 1-2 Status**: ✅ Complete
**Next Phase**: Frontend Development (Phase 3)
