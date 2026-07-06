import KnowledgeBase from '../models/KnowledgeBase.js';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

export const uploadDocument = async (file, uploadedBy, title = null, category = 'General', tags = []) => {
  try {
    const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = file.originalname || file.filename;
    const fileType = file.mimetype.includes('pdf')
      ? 'pdf'
      : (file.mimetype.includes('word') || fileName.endsWith('.docx'))
        ? 'docx'
        : 'txt';
    
    // Read file content based on type
    let content = '';
    if (fileType === 'pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      content = pdfData.text;
    } else if (fileType === 'docx') {
      const docxData = await mammoth.extractRawText({ path: file.path });
      content = docxData.value;
    } else {
      content = fs.readFileSync(file.path, 'utf-8');
    }

    content = content.substring(0, 10000); // Limit content size

    const document = new KnowledgeBase({
      docId,
      title: title || fileName,
      content,
      fileName,
      fileType,
      uploadedBy,
      category,
      tags: tags || [],
      searchIndex: `${title || fileName} ${content}`.substring(0, 500),
    });

    await document.save();

    // Clean up uploaded file
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    return document;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw { status: 500, message: 'Failed to upload document' };
  }
};

export const searchDocuments = async (query, limit = 10) => {
  try {
    const results = await KnowledgeBase.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit);

    return results;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw { status: 500, message: 'Failed to search documents' };
  }
};

export const getAllDocuments = async () => {
  const documents = await KnowledgeBase.find().sort({ createdAt: -1 });
  return documents;
};

export const deleteDocument = async (docId) => {
  const result = await KnowledgeBase.deleteOne({ _id: docId });
  if (result.deletedCount === 0) {
    throw { status: 404, message: 'Document not found' };
  }
  return result;
};

export const getDocumentsByCategory = async (category) => {
  const documents = await KnowledgeBase.find({ category }).sort({ createdAt: -1 });
  return documents;
};
