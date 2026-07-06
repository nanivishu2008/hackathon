import React, { useState, useEffect } from 'react';
import { FiUploadCloud, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { kbAPI } from '../services/api';

const KnowledgeUploadPage = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await kbAPI.getAllDocuments();
      setDocuments(response.data || []);
    } catch (err) {
      console.error('Error loading documents:', err);
      setMessage({ type: 'error', text: 'Failed to load documents' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setMessage({ type: '', text: '' });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one file' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await kbAPI.upload(formData);
      setMessage({ type: 'success', text: `${files.length} file(s) uploaded successfully` });
      setFiles([]);
      await loadDocuments();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to upload files';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Knowledge Base</h1>
          <p className="text-gray-600">Upload documents (PDF, TXT, DOCX) for the AI to learn from</p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <form onSubmit={handleUpload}>
            <div
              className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setFiles(Array.from(e.dataTransfer.files));
              }}
            >
              <FiUploadCloud className="mx-auto text-blue-600 mb-4" size={48} />
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Drag and drop files here
              </p>
              <p className="text-gray-600 mb-4">or</p>
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  Choose Files
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-4">
                Supported formats: PDF, TXT, DOCX
              </p>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Selected Files ({files.length})</h3>
                <ul className="space-y-2">
                  {files.map((file, idx) => (
                    <li key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">{file.name}</span>
                      <span className="text-sm text-gray-500">
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Message */}
            {message.text && (
              <div
                className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
                  message.type === 'error'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-green-50 border border-green-200'
                }`}
              >
                {message.type === 'error' ? (
                  <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <FiCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                )}
                <p className={message.type === 'error' ? 'text-red-600' : 'text-green-600'}>
                  {message.text}
                </p>
              </div>
            )}

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading || files.length === 0}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition"
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </button>
          </form>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Uploaded Documents</h2>

          {loading ? (
            <p className="text-gray-500">Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{doc.fileName}</p>
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {doc.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this document?')) {
                        try {
                          await kbAPI.deleteDocument(doc._id);
                          setMessage({ type: 'success', text: 'Document deleted successfully' });
                          await loadDocuments();
                        } catch (err) {
                          setMessage({ type: 'error', text: 'Failed to delete document' });
                        }
                      }
                    }}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeUploadPage;
