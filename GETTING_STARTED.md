# 🚀 GETTING STARTED - Quick 5-Minute Setup

Welcome! This guide will get you running in 5 minutes.

## ⚡ Ultra-Quick Start

### Step 1: Setup Backend (2 min)
```bash
cd backend
npm install
```

Create `backend/.env`:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-support
JWT_SECRET=your_secret_key_here
PORT=5000
GEMINI_API_KEY=your_api_key_here
```

```bash
npm run dev
```
✅ Backend running at http://localhost:5000

---

### Step 2: Setup Frontend (2 min)
Open NEW terminal:
```bash
cd frontend
npm install
npm start
```
✅ Frontend running at http://localhost:3000

---

### Step 3: Test It Out (1 min)
1. Open http://localhost:3000
2. Click "Register"
3. Create account with test@example.com / password123
4. Login
5. Try chatting with AI!

---

## 🔑 Getting Required Keys

### MongoDB Connection String
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account → Create cluster
3. Click "Connect" → Copy connection string
4. Replace `<password>` with your password
5. Use in `.env`

### Gemini API Key
1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Create new API key
4. Copy and paste in `.env`

---

## ✅ What Works Right Now

✅ User registration & login  
✅ Chat with AI (Gemini)  
✅ Upload documents (PDF/TXT/DOCX)  
✅ Search knowledge base  
✅ View analytics  
✅ Auto-escalation tickets  
✅ Real-time chat interface  

---

## 📚 Documentation

- **Setup Issues?** → See [INSTALLATION.md](docs/INSTALLATION.md)
- **API Reference** → See [API.md](docs/API.md)
- **Full Architecture** → See [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **How AI Works** → See [GEMINI_INTEGRATION.md](docs/GEMINI_INTEGRATION.md)

---

## 🛠️ Troubleshooting

### "Cannot find module 'express'"
```bash
npm install  # in backend folder
```

### "ECONNREFUSED - MongoDB"
- Check MongoDB connection string in `.env`
- Make sure cluster is running in MongoDB Atlas

### "Invalid API Key"
- Copy correct Gemini API key
- Verify it's active in Google AI Studio

### "Port already in use"
```bash
# Change PORT in .env to 5001
# Or kill process: lsof -ti:5000 | xargs kill -9
```

---

## 🎯 Next Steps

1. ✅ Get it running (you are here!)
2. 📤 Upload some documents to knowledge base
3. 💬 Chat and test AI responses
4. 📊 Check analytics dashboard
5. 🚀 Deploy when ready (user handles)

---

## 💡 Tips

- Frontend auto-reloads on file changes
- Backend needs manual restart for code changes
- Check browser console for errors (F12)
- Backend logs show detailed info

---

## 🆘 Still Stuck?

Check full documentation:
- [INSTALLATION.md](docs/INSTALLATION.md) - Detailed setup
- [PROJECT_REPORT.md](PROJECT_REPORT.md) - Project overview
- [API.md](docs/API.md) - All endpoints

Or ask questions in the code comments!

---

**Happy coding! 🎉**
