import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Ticket from '../models/Ticket.js';
import Analytics from '../models/Analytics.js';

export const getSummary = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChats = await Chat.countDocuments();
    const resolvedChats = await Chat.countDocuments({ status: 'closed' });
    const escalatedChats = await Ticket.countDocuments({ priority: 'high' });

    const analytics = {
      totalUsers,
      activeUsers: Math.floor(totalUsers * 0.3), // 30% active
      totalChats,
      totalMessages: totalChats * 3, // Average 3 messages per chat
      avgResponseTime: 2350, // ms
      satisfactionScore: 4.2,
      resolvedChats,
      escalatedChats,
      topicTrends: ['password reset', 'technical support', 'billing inquiry'],
    };

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

export const getDetailed = async (req, res, next) => {
  try {
    const analytics = await Analytics.findOne().sort({ createdAt: -1 });

    if (!analytics) {
      return res.status(404).json({ message: 'No analytics data found' });
    }

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};

export const recordAnalytics = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChats = await Chat.countDocuments();
    const resolvedChats = await Chat.countDocuments({ status: 'closed' });
    const escalatedChats = await Ticket.countDocuments({ status: 'open' });

    const analytics = new Analytics({
      totalUsers,
      activeUsers: Math.floor(totalUsers * 0.3),
      totalChats,
      totalMessages: totalChats * 3,
      avgResponseTime: 2350,
      satisfactionScore: 4.2,
      resolvedChats,
      escalatedChats,
      topicTrends: ['password reset', 'technical support', 'billing'],
    });

    await analytics.save();
  } catch (error) {
    console.error('Error recording analytics:', error);
  }
};
