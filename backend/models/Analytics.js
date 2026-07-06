import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    totalUsers: {
      type: Number,
      default: 0,
    },
    activeUsers: {
      type: Number,
      default: 0,
    },
    totalChats: {
      type: Number,
      default: 0,
    },
    totalMessages: {
      type: Number,
      default: 0,
    },
    avgResponseTime: {
      type: Number,
      default: 0,
    },
    satisfactionScore: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    resolvedChats: {
      type: Number,
      default: 0,
    },
    escalatedChats: {
      type: Number,
      default: 0,
    },
    topicTrends: [String],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Analytics', analyticsSchema);
