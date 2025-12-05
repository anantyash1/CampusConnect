// // /pages/api/assignment-question/index.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { getDatabase } from '@/lib/mongodb';
// import { ObjectId } from 'mongodb';
// import { uploadToCloudinary } from '@/lib/cloudinary';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // Helper to parse form data
// import { IncomingForm, Fields, Files } from 'formidable';

// const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
//   return new Promise((resolve, reject) => {
//     const form = new IncomingForm();
//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       else resolve({ fields, files });
//     });
//   });
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const db = await getDatabase();
//   const collection = db.collection('assignment_questions');

//   // ===== GET =====
//   if (req.method === 'GET') {
//     try {
//       const questions = await collection.find({}).sort({ upload_time: -1 }).toArray();
//       res.status(200).json(questions);
//     } catch (err) {
//       console.error('GET /assignment-questions error:', err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   }

//   // ===== POST =====
//   else if (req.method === 'POST') {
//     try {
//       const { fields, files } = await parseForm(req);

//       const file = Array.isArray(files.assignment_file)
//         ? files.assignment_file[0]
//         : files.assignment_file;

//       if (!file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//       }

//       // Read file and upload to Cloudinary
//       const fs = await import('fs/promises');
//       const fileBuffer = await fs.readFile(file.filepath);
      
//       // Upload to Cloudinary
//       const uploadResult = await uploadToCloudinary(fileBuffer, 'assignment-questions', 'raw');

//       const doc = {
//         teacher_name: Array.isArray(fields.teacher_name)
//           ? fields.teacher_name[0]
//           : fields.teacher_name,
//         subject_name: Array.isArray(fields.subject_name)
//           ? fields.subject_name[0]
//           : fields.subject_name,
//         semester: Array.isArray(fields.semester)
//           ? fields.semester[0]
//           : fields.semester,
//         assignment_title: Array.isArray(fields.assignment_title)
//           ? fields.assignment_title[0]
//           : fields.assignment_title,
//         assignment_type: Array.isArray(fields.assignment_type)
//           ? fields.assignment_type[0]
//           : fields.assignment_type,
//         cloudinary_url: uploadResult.secure_url,
//         cloudinary_public_id: uploadResult.public_id,
//         file_name: file.originalFilename || 'assignment',
//         file_size: uploadResult.bytes,
//         upload_time: new Date(),
//       };

//       await collection.insertOne(doc);
      
//       // Clean up temporary file
//       await fs.unlink(file.filepath);
      
//       res.status(201).json({ message: 'Assignment uploaded successfully' });
//     } catch (err) {
//       console.error('POST /assignment-questions error:', err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   }

//   // ===== DELETE =====
//   else if (req.method === 'DELETE') {
//     try {
//       const { id, teacher_name } = req.query;

//       if (id) {
//         // Get the document first to delete from Cloudinary
//         const doc = await collection.findOne({ _id: new ObjectId(id as string) });
//         if (doc && doc.cloudinary_public_id) {
//           const { deleteFromCloudinary } = await import('@/lib/cloudinary');
//           await deleteFromCloudinary(doc.cloudinary_public_id, 'raw');
//         }
//         await collection.deleteOne({ _id: new ObjectId(id as string) });
//       } else if (teacher_name) {
//         await collection.deleteMany({
//           teacher_name: { $regex: new RegExp(`^${teacher_name as string}$`, 'i') },
//         });
//       } else {
//         return res.status(400).json({ message: 'Missing id or teacher_name' });
//       }

//       res.status(200).json({ message: 'Assignment deleted successfully' });
//     } catch (err) {
//       console.error('DELETE /assignment-questions error:', err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   }

//   // ===== INVALID =====
//   else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }

// // pages/api/assignment-questions/index.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { getDatabase } from '@/lib/mongodb';
// import { ObjectId } from 'mongodb';
// import { uploadToCloudinary } from '@/lib/cloudinary';

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '10mb',
//     },
//   },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const db = await getDatabase();
//   const collection = db.collection('assignment_questions');

//   // ===== GET =====
//   if (req.method === 'GET') {
//     try {
//       const questions = await collection.find({}).sort({ upload_time: -1 }).toArray();
//       res.status(200).json(questions);
//     } catch (err) {
//       console.error('GET error:', err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   }

//   // ===== POST =====
//   else if (req.method === 'POST') {
//     try {
//       const {
//         teacher_name,
//         subject_name,
//         semester,
//         assignment_title,
//         assignment_type,
//         file_data, // Base64
//         file_name,
//         file_size,
//       } = req.body;

//       console.log('Received upload request:', {
//         teacher_name,
//         subject_name,
//         semester,
//         assignment_title,
//         assignment_type,
//         file_name,
//         file_size,
//         has_file_data: !!file_data,
//         file_data_length: file_data?.length
//       });

//       // Validate
//       if (!teacher_name || !subject_name || !semester || !assignment_title || !file_data) {
//         console.error('Missing required fields:', {
//           teacher_name: !teacher_name,
//           subject_name: !subject_name,
//           semester: !semester,
//           assignment_title: !assignment_title,
//           file_data: !file_data
//         });
//         return res.status(400).json({ 
//           message: 'Missing required fields' 
//         });
//       }

//       // Extract base64
//       const base64Data = file_data.split(',')[1];
//       if (!base64Data) {
//         console.error('Invalid base64 format');
//         return res.status(400).json({ 
//           message: 'Invalid file format' 
//         });
//       }

//       console.log('Converting base64 to buffer...');
//       // Convert to buffer
//       const fileBuffer = Buffer.from(base64Data, 'base64');
//       console.log('File buffer created, size:', fileBuffer.length);
      
//       // Upload to Cloudinary
//       console.log('Uploading to Cloudinary...');
//       const resourceType = assignment_type === 'PDF' ? 'raw' : 'image';
//       const uploadResult = await uploadToCloudinary(
//         fileBuffer, 
//         'assignment-questions', 
//         resourceType
//       );
//       console.log('Cloudinary upload successful:', {
//         url: uploadResult.secure_url,
//         public_id: uploadResult.public_id,
//         size: uploadResult.bytes
//       });

//       // Create document - REMOVED assignment_file field, ADDED cloudinary fields
//       const doc = {
//         teacher_name,
//         subject_name,
//         semester,
//         assignment_title,
//         assignment_type: assignment_type || 'PDF',
//         cloudinary_url: uploadResult.secure_url,
//         cloudinary_public_id: uploadResult.public_id,
//         cloudinary_format: uploadResult.format,
//         file_name: file_name || 'assignment',
//         file_size: uploadResult.bytes,
//         upload_time: new Date(),
//       };

//       console.log('Saving to MongoDB:', {
//         teacher_name: doc.teacher_name,
//         subject_name: doc.subject_name,
//         assignment_title: doc.assignment_title,
//         cloudinary_url: doc.cloudinary_url,
//         file_size: doc.file_size
//       });

//       const result = await collection.insertOne(doc);
//       console.log('MongoDB insert successful, ID:', result.insertedId);
      
//       res.status(201).json({ 
//         message: 'Assignment uploaded successfully',
//         cloudinary_url: uploadResult.secure_url,
//         id: result.insertedId
//       });
      
//     } catch (err: any) {
//       console.error('POST error details:', err);
//       res.status(500).json({ 
//         message: 'Upload failed',
//         error: process.env.NODE_ENV === 'development' ? err.message : undefined
//       });
//     }
//   }

//   // ===== DELETE =====
//   else if (req.method === 'DELETE') {
//     try {
//       const { id, teacher_name } = req.query;

//       if (id) {
//         await collection.deleteOne({ _id: new ObjectId(id as string) });
//       } else if (teacher_name) {
//         await collection.deleteMany({
//           teacher_name: { $regex: new RegExp(`^${teacher_name as string}$`, 'i') },
//         });
//       } else {
//         return res.status(400).json({ message: 'Missing id or teacher_name' });
//       }

//       res.status(200).json({ message: 'Assignment deleted successfully' });
//     } catch (err) {
//       console.error('DELETE error:', err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   }

//   else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }


// pages/api/assignment-questions/index.ts
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
      
      // Transform data to ensure consistent structure
      const transformedQuestions = questions.map(q => ({
        _id: q._id,
        assignment_title: q.assignment_title || '',
        teacher_name: q.teacher_name || '',
        subject_name: q.subject_name || '',
        semester: q.semester || '',
        assignment_type: q.assignment_type || 'PDF',
        cloudinary_url: q.cloudinary_url || null,
        cloudinary_public_id: q.cloudinary_public_id || null,
        cloudinary_format: q.cloudinary_format || 'pdf',
        file_name: q.file_name || 'assignment',
        file_size: q.file_size || 0,
        upload_time: q.upload_time || new Date(),
      }));
      
      res.status(200).json(transformedQuestions);
    } catch (err) {
      console.error('GET error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // ===== POST =====
  else if (req.method === 'POST') {
    let fileBuffer: Buffer;
    
    try {
      const {
        teacher_name,
        subject_name,
        semester,
        assignment_title,
        assignment_type,
        file_data, // Base64
        file_name,
        file_size,
      } = req.body;

      console.log('📤 Received upload request for:', {
        teacher_name,
        subject_name,
        semester,
        assignment_title,
        assignment_type,
        file_name,
        file_size,
      });

      // Validate required fields
      if (!teacher_name || !subject_name || !semester || !assignment_title || !file_data) {
        return res.status(400).json({ 
          message: 'Missing required fields' 
        });
      }

      // Validate file_data is a string
      if (typeof file_data !== 'string') {
        return res.status(400).json({ 
          message: 'file_data must be a base64 string' 
        });
      }

      // Extract base64 data (remove data:application/pdf;base64, prefix)
      const base64Match = file_data.match(/^data:[^;]+;base64,(.+)$/);
      if (!base64Match) {
        return res.status(400).json({ 
          message: 'Invalid base64 format. Must start with data:[type];base64,' 
        });
      }

      const base64Data = base64Match[1];
      
      // Convert to buffer
      console.log('🔄 Converting base64 to buffer...');
      try {
        fileBuffer = Buffer.from(base64Data, 'base64');
        console.log('✅ Buffer created, size:', fileBuffer.length, 'bytes');
      } catch (bufferError) {
        console.error('❌ Buffer conversion failed:', bufferError);
        return res.status(400).json({ 
          message: 'Failed to process file data' 
        });
      }

      // Upload to Cloudinary with proper resource type
      const resourceType = assignment_type === 'PDF' ? 'raw' : 'image';
      console.log('☁️ Uploading to Cloudinary...', { resourceType });
      
      let uploadResult;
      try {
        uploadResult = await uploadToCloudinary(
          fileBuffer, 
          'assignment-questions', 
          resourceType
        );
        console.log('✅ Cloudinary upload successful:', {
          url: uploadResult.secure_url.substring(0, 50) + '...',
          public_id: uploadResult.public_id,
          size: uploadResult.bytes,
          format: uploadResult.format,
          resource_type: uploadResult.resource_type
        });
      } catch (cloudinaryError: any) {
        console.error('❌ Cloudinary upload failed:', cloudinaryError);
        return res.status(500).json({ 
          message: 'Failed to upload to Cloudinary',
          error: process.env.NODE_ENV === 'development' ? cloudinaryError.message : undefined
        });
      }

      // Create document with Cloudinary fields
      const doc = {
        teacher_name: teacher_name.trim(),
        subject_name: subject_name.trim(),
        semester: semester.trim(),
        assignment_title: assignment_title.trim(),
        assignment_type: (assignment_type || 'PDF').toUpperCase(),
        cloudinary_url: uploadResult.secure_url,
        cloudinary_public_id: uploadResult.public_id,
        cloudinary_format: uploadResult.format,
        cloudinary_resource_type: uploadResult.resource_type,
        file_name: file_name || 'assignment',
        file_size: uploadResult.bytes,
        upload_time: new Date(),
      };

      console.log('💾 Saving to MongoDB:', {
        title: doc.assignment_title,
        teacher: doc.teacher_name,
        subject: doc.subject_name,
        file_size: doc.file_size,
        cloudinary_url: doc.cloudinary_url
      });

      // Save to MongoDB
      const result = await collection.insertOne(doc);
      console.log('✅ MongoDB insert successful, ID:', result.insertedId);
      
      res.status(201).json({ 
        message: 'Assignment uploaded successfully',
        cloudinary_url: uploadResult.secure_url,
        id: result.insertedId,
        file_name: doc.file_name,
        download_url: `/api/download-assignment?id=${result.insertedId}`
      });
      
    } catch (err: any) {
      console.error('❌ POST error:', err);
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