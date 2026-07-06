import { uploadDocument, searchDocuments, getAllDocuments, deleteDocument } from '../services/kbService.js';

export const upload = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    const uploadedDocuments = [];

    for (const file of files) {
      const document = await uploadDocument(file, userId);
      uploadedDocuments.push(document);
    }

    res.status(201).json({
      message: `${uploadedDocuments.length} document(s) uploaded successfully`,
      documents: uploadedDocuments,
    });
  } catch (error) {
    next(error);
  }
};

export const search = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const results = await searchDocuments(q);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const documents = await getAllDocuments();
    res.json(documents);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { docId } = req.params;
    await deleteDocument(docId);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};
