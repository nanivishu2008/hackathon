import mongoose from 'mongoose';

const knowledgeBaseSchema = new mongoose.Schema(
  {
    docId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'txt', 'docx'],
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    tags: [String],
    searchIndex: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Text index for full-text search
knowledgeBaseSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model('KnowledgeBase', knowledgeBaseSchema);
