// /pages/api/student-answers/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // For base64 files
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDatabase();
  const studentAnswersCollection = db.collection('student_answers');

  // ✅ POST: Upload assignment
  if (req.method === 'POST') {
    try {
      const {
        student_name,
        usn,
        subject_name,
        section,
        branch,
        file_type,
        file_data, // Base64 string
        file_name,
        file_size,
      } = req.body;

      // Validate required fields
      if (!student_name || !usn || !subject_name || !file_data) {
        return res.status(400).json({
          message: 'Missing required fields'
        });
      }

      if (typeof file_data !== 'string') {
        return res.status(400).json({
          message: 'file_data must be a base64 string'
        });
      }

      // Extract base64 data
      const base64Data = file_data.split(',')[1];
      if (!base64Data) {
        return res.status(400).json({
          message: 'Invalid base64 format'
        });
      }

      // Convert to buffer
      const fileBuffer = Buffer.from(base64Data, 'base64');
      
      // Upload to Cloudinary
      const resourceType = file_type === 'PDF' ? 'raw' : 'image';
      const uploadResult = await uploadToCloudinary(
        fileBuffer, 
        'student-assignments', 
        resourceType
      );

      // Create document
      const answerData = {
        student_name: student_name.trim(),
        usn: usn.toUpperCase().trim(),
        subject_name: subject_name.toUpperCase().trim(),
        section: section ? section.toUpperCase().trim() : 'N/A',
        branch: branch ? branch.toUpperCase().trim() : 'N/A',
        file_type: file_type ? file_type.toUpperCase() : 'PDF',
        file_name: file_name || 'assignment',
        file_size: file_size || fileBuffer.length,
        cloudinary_url: uploadResult.secure_url,
        cloudinary_public_id: uploadResult.public_id,
        cloudinary_format: uploadResult.format,
        upload_time: new Date(),
      };

      // Save to MongoDB
      const result = await studentAnswersCollection.insertOne(answerData);

      res.status(201).json({
        message: 'Assignment uploaded successfully',
        id: result.insertedId,
        cloudinary_url: uploadResult.secure_url
      });

    } catch (error: any) {
      console.error('❌ Upload error:', error);
      
      if (error.message?.includes('File size too large')) {
        return res.status(413).json({
          message: 'File too large. Maximum 10MB allowed.'
        });
      }
      
      res.status(500).json({
        message: 'Upload failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // ✅ GET: Fetch answers
  else if (req.method === 'GET') {
    try {
      const { branch, section, subject_name } = req.query;

      const query: any = {};
      if (branch && branch !== 'undefined') query.branch = branch;
      if (section && section !== 'undefined') query.section = section;
      if (subject_name && subject_name !== 'undefined') query.subject_name = subject_name;

      const answers = await studentAnswersCollection
        .find(query)
        .sort({ upload_time: -1 })
        .toArray();

      res.status(200).json(answers);
    } catch (error) {
      console.error('❌ Fetch error:', error);
      res.status(500).json({ message: 'Failed to fetch answers' });
    }
  }

  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}