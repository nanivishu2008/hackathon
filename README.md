# AI Customer Support & Knowledge Assistant

A comprehensive AI-powered customer support system that provides instant answers, maintains conversation history, escalates complex queries, and provides analytics.

## 🎯 Project Objective

- Answer customer questions instantly using AI
- Search company documents and FAQs
- Generate context-aware responses using Gemini API
- Maintain conversation history
- Escalate complex queries to human support
- Provide analytics and reports
- Autonomous agent for ticket creation and notifications

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Tailwind CSS, HTML/CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **AI** | Google Gemini API |
| **Auth** | JWT (JSON Web Tokens) |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend), MongoDB Atlas |

## 📁 Project Structure

```
hackathon/
├── frontend/                 # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.local
├── backend/                  # Express backend server
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── services/            # Business logic
│   ├── uploads/             # Document uploads
│   ├── server.js
│   ├── package.json
│   └── .env
├── docs/                    # Documentation
├── presentation/            # Presentation files
└── README.md
```

## 📋 Project Phases

1. **Phase 1-2**: Planning & System Design (Days 1-3)
2. **Phase 3**: Frontend Development (Days 4-8)
3. **Phase 4**: Backend Development (Days 9-14)
4. **Phase 5**: Gemini AI Integration (Days 15-18)
5. **Phase 6**: Intelligent Agent Features (Days 19-21)
6. **Phase 7**: Testing (Days 22-24)
7. **Phase 8**: Deployment (Days 25-26) - *User handles deployment*
8. **Phase 9**: Documentation (Day 27)
9. **Phase 10**: Final Presentation (Day 28)

## 🚀 Quick Start

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Environment Variables

**Frontend** (.env.local):
```
REACT_APP_API_URL=http://localhost:5000
```

**Backend** (.env):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development
```

## 📚 Features

### Phase 1: Core Features
- [ ] User Authentication (Register/Login/Logout)
- [ ] Chat Interface
- [ ] Knowledge Base Upload
- [ ] Document Search
- [ ] Conversation History

### Phase 2: AI Features
- [ ] Gemini API Integration
- [ ] Context-Aware Responses
- [ ] Sentiment Analysis
- [ ] FAQ Matching

### Phase 3: Agent Features
- [ ] Support Ticket Creation
- [ ] Email Notifications
- [ ] Query Escalation
- [ ] Summary Generation
- [ ] Follow-up Scheduling

### Phase 4: Analytics
- [ ] User Dashboard
- [ ] Analytics Panel
- [ ] Response Time Metrics
- [ ] Customer Satisfaction Tracking

## 🔗 Key APIs

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Chat
- `POST /chat/send-message` - Send message
- `GET /chat/history/:chatId` - Fetch chat history
- `DELETE /chat/:chatId` - Delete chat

### Knowledge Base
- `POST /kb/upload` - Upload documents
- `GET /kb/search` - Search documents
- `DELETE /kb/:docId` - Delete document

### Analytics
- `GET /analytics/summary` - Get analytics summary
- `GET /analytics/users` - Total users
- `GET /analytics/chats` - Total chats

## 📊 Database Schema

### Users Collection
- userId, email, password (hashed), role, createdAt, updatedAt

### Chats Collection
- chatId, userId, messages[], createdAt, updatedAt

### KnowledgeBase Collection
- docId, title, content, uploadedBy, createdAt, updatedAt

### Tickets Collection
- ticketId, chatId, userId, status, priority, createdAt, updatedAt

### Analytics Collection
- analyticsId, totalUsers, totalChats, avgResponseTime, satisfactionScore, timestamp

## 📝 Documentation Files

- [API Documentation](./docs/API.md) - Complete API reference
- [Database Schema](./docs/DATABASE.md) - Database design
- [Architecture Diagram](./docs/ARCHITECTURE.md) - System architecture
- [Installation Guide](./docs/INSTALLATION.md) - Setup instructions

## 🎓 Learning Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Google Gemini API](https://ai.google.dev/)
- [JWT Guide](https://jwt.io/)

## 📧 Contact & Support

For questions or support, please create an issue in the GitHub repository.

---

**Project Status**: In Development 🔨
**Last Updated**: 2026-07-06
