import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import KnowledgeBase from './models/KnowledgeBase.js';

async function inspect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const docs = await KnowledgeBase.find();
    console.log(`Found ${docs.length} documents in KnowledgeBase:`);
    docs.forEach((doc, idx) => {
      console.log(`\n--- Document #${idx+1} ---`);
      console.log(`ID: ${doc._id}`);
      console.log(`DocId: ${doc.docId}`);
      console.log(`Title: ${doc.title}`);
      console.log(`FileName: ${doc.fileName}`);
      console.log(`FileType: ${doc.fileType}`);
      console.log(`Content length: ${doc.content ? doc.content.length : 0}`);
      console.log(`Content preview: ${doc.content ? doc.content.substring(0, 200) : ''}`);
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

inspect();
