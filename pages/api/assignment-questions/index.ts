// /pages/api/assignment-question/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDatabase();
  const collection = db.collection('assignment_questions');

  // ===== GET =====
  if (req.method === 'GET') {
    try {
      const questions = await collection.find({}).sort({ upload_time: -1 }).toArray();
      res.status(200).json(questions);
    } catch (err) {
      console.error('GET error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // ===== POST ===== (Now uses base64 instead of formidable)
  else if (req.method === 'POST') {
    try {
      const {
        teacher_name,
        subject_name,
        semester,
        assignment_title,
        assignment_type,
        file_data, // Base64
        file_name,
      } = req.body;

      // Validate
      if (!teacher_name || !subject_name || !semester || !assignment_title || !file_data) {
        return res.status(400).json({ 
          message: 'Missing required fields' 
        });
      }

      // Extract base64
      const base64Data = file_data.split(',')[1];
      if (!base64Data) {
        return res.status(400).json({ 
          message: 'Invalid file format' 
        });
      }

      // Convert to buffer
      const fileBuffer = Buffer.from(base64Data, 'base64');
      
      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(
        fileBuffer, 
        'assignment-questions', 
        'raw'
      );

      // Create document
      const doc = {
        teacher_name,
        subject_name,
        semester,
        assignment_title,
        assignment_type: assignment_type || 'PDF',
        cloudinary_url: uploadResult.secure_url,
        cloudinary_public_id: uploadResult.public_id,
        file_name: file_name || 'assignment',
        file_size: uploadResult.bytes,
        upload_time: new Date(),
      };

      await collection.insertOne(doc);
      
      res.status(201).json({ 
        message: 'Assignment uploaded successfully',
        cloudinary_url: uploadResult.secure_url
      });
      
    } catch (err: any) {
      console.error('POST error:', err);
      res.status(500).json({ 
        message: 'Upload failed',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }

  // ===== DELETE =====
  else if (req.method === 'DELETE') {
    try {
      const { id, teacher_name } = req.query;

      if (id) {
        await collection.deleteOne({ _id: new ObjectId(id as string) });
      } else if (teacher_name) {
        await collection.deleteMany({
          teacher_name: { $regex: new RegExp(`^${teacher_name as string}$`, 'i') },
        });
      } else {
        return res.status(400).json({ message: 'Missing id or teacher_name' });
      }

      res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (err) {
      console.error('DELETE error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}