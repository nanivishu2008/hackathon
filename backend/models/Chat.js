import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  messageId: String,
  sender: {
    type: String,
    enum: ['user', 'ai'],
  },
  content: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: null,
  },
});

const chatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'New Chat',
    },
    messages: [messageSchema],
    status: {
      type: String,
      enum: ['active', 'archived', 'closed'],
      default: 'active',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    lastMessage: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Chat', chatSchema);
