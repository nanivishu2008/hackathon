# Installation & Setup Guide

## Prerequisites

Before installing, ensure you have:
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** account (Atlas or local)
- **Google Gemini API key**
- **Git** (optional)

## Step-by-Step Installation

### 1. Clone or Download Project

```bash
# If using git
git clone <repository-url>
cd hackathon

# Or extract from zip file
unzip hackathon.zip
cd hackathon
```

### 2. Setup Backend

#### 2.1 Navigate to Backend

```bash
cd backend
```

#### 2.2 Install Dependencies

```bash
npm install
```

#### 2.3 Configure Environment Variables

Create `.env` file in `backend/` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-support?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# File Upload
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10000000
ALLOWED_FILE_TYPES=pdf,txt,docx
```

**Getting MongoDB Connection String**:
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`

**Getting Gemini API Key**:
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create new API key
4. Copy and paste in `.env`

#### 2.4 Create Uploads Directory

```bash
mkdir uploads
```

#### 2.5 Start Backend Server

```bash
# Development with auto-reload
npm run dev

# Or production
npm start
```

Expected output:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
📚 API Routes listed...
```

---

### 3. Setup Frontend

#### 3.1 Open New Terminal/Command Prompt

Navigate to frontend:
```bash
cd frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

#### 3.3 Configure Environment Variables

Create `.env.local` file in `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=30000
```

#### 3.4 Start Frontend Development Server

```bash
npm start
```

Expected output:
```
Compiled successfully!
On Your Network: http://localhost:3000
```

The app will automatically open in your browser at `http://localhost:3000`

---

## Verification

### Backend Verification

```bash
# In backend directory
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-07-06T10:00:00.000Z"
}
```

### Frontend Verification

1. Visit `http://localhost:3000` in browser
2. You should see the home page
3. Try to register a new account
4. Login with credentials
5. Start chatting with AI

---

## Project Structure

```
hackathon/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # State management
│   │   ├── services/        # API calls
│   │   ├── utils/           # Helper functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.local
│
├── backend/                  # Node/Express server
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth & error handling
│   ├── services/            # Business logic
│   ├── uploads/             # Uploaded files
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .env
│
└── docs/                     # Documentation
    ├── PLANNING.md
    ├── DATABASE.md
    ├── API.md
    ├── GEMINI_INTEGRATION.md
    ├── AGENT_FEATURES.md
    ├── TESTING.md
    └── INSTALLATION.md
```

---

## Troubleshooting

### MongoDB Connection Error

**Problem**: `MongooseError: connect ECONNREFUSED`

**Solution**:
1. Check MongoDB Atlas cluster is running
2. Verify connection string in `.env`
3. Ensure IP whitelist includes your IP
4. Check network connectivity

### Gemini API Errors

**Problem**: `Error: Invalid API key`

**Solution**:
1. Verify API key in `.env` is correct
2. Check key is active in Google AI Studio
3. Regenerate key if needed
4. Ensure API is enabled

### Port Already in Use

**Problem**: `Error: Port 5000 is already in use`

**Solution**:
```bash
# Change PORT in .env
PORT=5001

# Or kill process using port (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Or (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Errors

**Problem**: `Access to XMLHttpRequest blocked by CORS`

**Solution**:
1. Check backend `.env` has correct CORS setup
2. Verify `REACT_APP_API_URL` in frontend `.env`
3. Ensure both servers are running

---

## Running with Docker (Optional)

### Docker Compose

```yaml
# docker-compose.yml
version: '3'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/ai-support
      - JWT_SECRET=secret
      - GEMINI_API_KEY=your_key
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
```

Run with Docker:
```bash
docker-compose up
```

---

## Development Tips

### Hot Reload

**Frontend** - Automatically reloads on file changes
**Backend** - Use `nodemon` for auto-reload:
```bash
npm run dev
```

### Debug Mode

**Frontend**:
1. Open DevTools (F12)
2. Set breakpoints in Code tab
3. Step through code

**Backend**:
```bash
# Enable debug logging
DEBUG=* npm start
```

### Testing Endpoints

Use Postman or cURL:

```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Send message (with token)
curl -X POST http://localhost:5000/chat/send-message \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "chat_123",
    "content": "Hello!"
  }'
```

---

## Next Steps

1. **Upload Knowledge Base Documents**
   - Go to http://localhost:3000/upload
   - Upload PDF, TXT, or DOCX files
   - AI will use them for responses

2. **Start Chatting**
   - Navigate to Chat page
   - Ask questions
   - AI will provide answers using knowledge base

3. **View Analytics**
   - Check Analytics page for metrics
   - Monitor system performance

4. **Deployment** (User handles)
   - Deploy frontend to Vercel
   - Deploy backend to Render/Railway
   - Setup MongoDB Atlas

---

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Node.js | v16 | v18+ |
| RAM | 2GB | 4GB+ |
| Storage | 500MB | 2GB+ |
| Internet | Required | Required |

---

## Support & Troubleshooting

For issues:
1. Check documentation files
2. Review error messages carefully
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Visit [GitHub Issues](https://github.com/yourrepo/issues)

---

**Installation Guide Version**: 1.0  
**Last Updated**: 2026-07-06
