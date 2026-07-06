# System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React.js Frontend (Web)                     │  │
│  │  ┌────────────┬─────────┬──────────┬──────────┐          │  │
│  │  │Chat Page   │Dashboard│Analytics │Upload    │          │  │
│  │  └────────────┴─────────┴──────────┴──────────┘          │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │         State Management (Context API)          │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                    │                                            │
│                    │ Axios HTTP/REST                            │
│                    ▼                                            │
└─────────────────────────────────────────────────────────────────┘
                     │
                     │ JWT Authentication
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Express.js Server (Node.js)                │  │
│  │                                                           │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │              API Routes                          │   │  │
│  │  │  /auth, /chat, /kb, /analytics                  │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                     │                                    │  │
│  │  ┌─────────────────┴──────────────────────────────┐     │  │
│  │  │         Controllers & Middleware               │     │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐    │     │  │
│  │  │  │Auth      │  │Chat      │  │KB        │    │     │  │
│  │  │  │Controller│  │Controller│  │Controller│    │     │  │
│  │  │  └──────────┘  └──────────┘  └──────────┘    │     │  │
│  │  └─────────────────┬──────────────────────────────┘     │  │
│  │                    │                                    │  │
│  │  ┌─────────────────▼──────────────────────────────┐     │  │
│  │  │           Services Layer                       │     │  │
│  │  │  ┌──────────────────────────────────────────┐ │     │  │
│  │  │  │  authService  (Auth Logic)              │ │     │  │
│  │  │  │  chatService  (Chat Management)         │ │     │  │
│  │  │  │  aiService    (Gemini Integration)      │ │     │  │
│  │  │  │  agentService (Autonomous Actions)      │ │     │  │
│  │  │  │  kbService    (Knowledge Base)          │ │     │  │
│  │  │  └──────────────────────────────────────────┘ │     │  │
│  │  └─────────────────┬──────────────────────────────┘     │  │
│  │  ┌─────────────────▼──────────────────────────────┐     │  │
│  │  │        Data Models (Mongoose)                 │     │  │
│  │  │  ┌─────────┐  ┌───────┐  ┌─────────────┐    │     │  │
│  │  │  │User     │  │Chat   │  │KnowledgeBase│   │     │  │
│  │  │  │Ticket   │  │Analytics                │   │     │  │
│  │  │  └─────────┘  └───────┘  └─────────────┘    │     │  │
│  │  └─────────────────┬──────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                     │                                           │
└─────────────────────┼───────────────────────────────────────────┘
      ┌──────────────┬┴──────────────┬──────────────────┐
      ▼              ▼               ▼                 ▼
┌──────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐
│ MongoDB  │  │ Gemini API │  │File Storage│  │Email Service │
│ Database │  │(AI Engine) │  │(Uploads)   │  │(Notifications)
└──────────┘  └────────────┘  └────────────┘  └──────────────┘
```

---

## Component Architecture

### Frontend Architecture

```
Frontend (React)
├── pages/
│   ├── HomePage.js          # Landing page
│   ├── LoginPage.js         # User login
│   ├── RegisterPage.js      # User registration
│   ├── ChatPage.js          # Main chat interface
│   ├── DashboardPage.js     # Dashboard & stats
│   ├── AnalyticsPage.js     # Analytics dashboard
│   └── KnowledgeUploadPage.js # Document upload
│
├── components/
│   ├── Navbar.js            # Navigation header
│   ├── Sidebar.js           # Side navigation
│   ├── Message.js           # Chat message bubble
│   └── ChatInput.js         # Message input form
│
├── context/
│   └── AuthContext.js       # Auth state management
│
├── services/
│   └── api.js               # API client & axios config
│
└── utils/
    └── helpers.js           # Helper functions
```

### Backend Architecture

```
Backend (Node.js + Express)
├── models/
│   ├── User.js              # User schema
│   ├── Chat.js              # Chat/messages schema
│   ├── KnowledgeBase.js     # Documents schema
│   ├── Ticket.js            # Support tickets schema
│   └── Analytics.js         # Analytics schema
│
├── controllers/
│   ├── authController.js    # Auth endpoints
│   ├── chatController.js    # Chat endpoints
│   ├── kbController.js      # Knowledge base endpoints
│   └── analyticsController.js # Analytics endpoints
│
├── routes/
│   ├── authRoutes.js        # Auth routes
│   ├── chatRoutes.js        # Chat routes
│   ├── kbRoutes.js          # KB routes
│   └── analyticsRoutes.js   # Analytics routes
│
├── services/
│   ├── authService.js       # Auth business logic
│   ├── chatService.js       # Chat management logic
│   ├── aiService.js         # Gemini integration
│   ├── agentService.js      # Agent logic
│   └── kbService.js         # KB management logic
│
├── middleware/
│   └── auth.js              # JWT auth & error handling
│
└── server.js                # Entry point
```

---

## Data Flow

### User Registration Flow

```
1. User fills registration form
   └─► Frontend validates input
       └─► POST /auth/register with credentials
           └─► Backend validates & sanitizes
               └─► Hash password with bcrypt
                   └─► Create User document in MongoDB
                       └─► Generate JWT token
                           └─► Return user + token
                               └─► Store in localStorage
                                   └─► Redirect to chat page
```

### Chat Message Flow

```
1. User sends message
   └─► Frontend adds to message history (UI)
       └─► POST /chat/send-message
           └─► Backend receives message
               ├─► Save user message to Chat document
               ├─► Search KnowledgeBase for context
               ├─► Call Gemini API with:
               │   ├─ User message
               │   ├─ Chat history (last 10 messages)
               │   └─ Knowledge context (top 3 docs)
               ├─► Gemini generates response
               ├─► Calculate confidence score
               ├─► Check if escalation needed (confidence < 0.6)
               │   └─► Auto-create support ticket
               ├─► Save AI message to Chat
               └─► Return response + metadata
                   └─► Frontend displays response
```

### Knowledge Base Upload Flow

```
1. User uploads document
   └─► Frontend validates file type & size
       └─► POST /kb/upload with FormData
           └─► Backend receives file via multer
               ├─► Validate file type
               ├─► Save to /uploads directory
               ├─► Extract content (PDF/DOCX/TXT)
               ├─► Create KnowledgeBase document with:
               │   ├─ Extracted content
               │   ├─ Title, filename, type
               │   └─ Search index
               ├─► Save to MongoDB
               └─► Return success + document metadata
                   └─► Frontend updates document list
```

---

## Database Schema Relationships

```
Users
├── 1:N ─────► Chats
│             └── N:1 ─────► Messages
│
├── 1:N ─────► KnowledgeBase
│             (uploadedBy)
│
└── 1:N ─────► Tickets
              (createdBy, assignedTo)

Chats
├── 1:N ─────► Tickets (relatedChat)
└── 1:N ─────► Messages (embedded)

Analytics
└── Daily snapshots of system metrics
```

---

## API Request/Response Cycle

```
CLIENT                          SERVER
  │                               │
  │ 1. HTTP Request               │
  ├──────────────────────────────►│
  │ (with JWT in header)          │
  │                               │ 2. Auth Middleware
  │                               │    Verify JWT
  │                               │
  │                               │ 3. Route Matching
  │                               │    Find handler
  │                               │
  │                               │ 4. Controller
  │                               │    Process request
  │                               │
  │                               │ 5. Service
  │                               │    Business logic
  │                               │
  │                               │ 6. Database
  │                               │    Query/Update
  │                               │
  │ 7. HTTP Response              │
  │◄──────────────────────────────┤
  │ (JSON + status code)          │
  │                               │
```

---

## Security Architecture

```
┌─────────────────────────────────────────────┐
│           Security Layers                    │
├─────────────────────────────────────────────┤
│ 1. HTTPS/TLS (Transport)                    │
│    └─ Secure communication between client   │
│       and server                            │
├─────────────────────────────────────────────┤
│ 2. JWT Authentication                       │
│    └─ Token-based stateless auth            │
│    └─ Expires in 7 days                     │
│    └─ Signed with secret key                │
├─────────────────────────────────────────────┤
│ 3. Password Security                        │
│    └─ Bcrypt hashing (10 salt rounds)       │
│    └─ Never store plain text                │
├─────────────────────────────────────────────┤
│ 4. CORS (Cross-Origin)                      │
│    └─ Restrict API calls to frontend        │
│    └─ Prevent unauthorized access           │
├─────────────────────────────────────────────┤
│ 5. Input Validation                         │
│    └─ Validate all user inputs              │
│    └─ Sanitize data before storage          │
│    └─ Prevent injection attacks             │
├─────────────────────────────────────────────┤
│ 6. File Upload Security                     │
│    └─ Validate file type                    │
│    └─ Limit file size (10MB)                │
│    └─ Store outside web root                │
├─────────────────────────────────────────────┤
│ 7. Environment Variables                    │
│    └─ Store secrets in .env                 │
│    └─ Never commit .env to git              │
│    └─ Rotate keys regularly                 │
└─────────────────────────────────────────────┘
```

---

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
├── Backend Instance 1 (Server A)
├── Backend Instance 2 (Server B)
├── Backend Instance 3 (Server C)
└── Backend Instance N

Shared Resources:
├── MongoDB (Replica Set)
├── Redis Cache (for sessions)
└── S3 Storage (for uploads)
```

### Performance Optimization

1. **Caching**
   - Cache knowledge base searches
   - Store recent chat histories
   - Cache analytics results

2. **Database Indexing**
   - Full-text indexes on documents
   - Compound indexes on frequently queried fields
   - TTL indexes for cleanup

3. **API Optimization**
   - Pagination for large result sets
   - Gzip compression
   - Request throttling

4. **Frontend Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization

---

## Monitoring & Observability

```
Application
├── Logs (Console, Files)
│   └─ Track errors, warnings, info
│
├── Metrics
│   ├─ Request count
│   ├─ Response time
│   ├─ Error rate
│   └─ API usage
│
├── Traces
│   └─ Request path through system
│
└── Alerts
    ├─ High error rate
    ├─ Slow response times
    ├─ Failed API calls
    └─ Resource exhaustion
```

---

## Deployment Architecture

```
Development
├── localhost:3000 (Frontend)
└── localhost:5000 (Backend)

Production
├── Vercel (Frontend)
│   └─ Auto-deployed from GitHub
│   └─ CDN worldwide
│   └─ SSL included
│
├── Render/Railway (Backend)
│   └─ Managed Node.js hosting
│   └─ Auto-scaling
│   └─ Monitoring
│
└── MongoDB Atlas (Database)
    └─ Cloud MongoDB
    └─ Replicated for HA
    └─ Automated backups
```

---

**Architecture Documentation**: ✅ Complete
**Version**: 1.0
