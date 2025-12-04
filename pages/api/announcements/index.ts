// pages/api/announcements/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Log every request
  console.log('=== ANNOUNCEMENTS API CALLED ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch all announcements
  if (req.method === 'GET') {
    try {
      console.log('Fetching announcements...');
      const db = await getDatabase();
      const announcementsCollection = db.collection('announcements');
      
      const announcements = await announcementsCollection
        .find({})
        .sort({ timestamp: -1 })
        .toArray();

      console.log(`Found ${announcements.length} announcements`);
      res.status(200).json(announcements);
    } catch (error: any) {
      console.error('GET Error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch announcements',
        error: error.message 
      });
    }
  }

  // POST: Create announcement
  else if (req.method === 'POST') {
    try {
      console.log('POST Request Body:', JSON.stringify(req.body).substring(0, 200)); // First 200 chars
      
      const { type, posted_by, content, caption, image_data } = req.body;

      console.log('Parsed data:', {
        type,
        posted_by,
        hasContent: !!content,
        hasImageData: !!image_data,
        imageDataLength: image_data?.length
      });

      // Validate required fields
      if (!type || !posted_by) {
        console.error('Missing required fields');
        return res.status(400).json({ 
          message: 'Type and posted_by are required fields' 
        });
      }

      if (type === 'text' && !content) {
        console.error('Missing content for text announcement');
        return res.status(400).json({ 
          message: 'Content is required for text announcements' 
        });
      }

      if (type === 'image' && !image_data) {
        console.error('Missing image_data for image announcement');
        return res.status(400).json({ 
          message: 'Image data is required for image announcements' 
        });
      }

      // Connect to database
      console.log('Connecting to database...');
      const db = await getDatabase();
      const announcementsCollection = db.collection('announcements');

      const announcement: any = {
        type,
        posted_by: posted_by.trim(),
        timestamp: new Date(),
      };

      if (type === 'text') {
        announcement.content = content.trim();
        console.log('Text announcement ready');
      } else if (type === 'image' && image_data) {
        try {
          console.log('Processing image upload...');
          
          // Validate base64 format
          if (!image_data.startsWith('data:image/')) {
            console.error('Invalid image format');
            return res.status(400).json({
              message: 'Invalid image format. Please upload a valid image file.'
            });
          }

          const base64Data = image_data.split(',')[1];
          if (!base64Data) {
            console.error('No base64 data found');
            return res.status(400).json({
              message: 'Invalid image data'
            });
          }

          // Convert to buffer
          const imageBuffer = Buffer.from(base64Data, 'base64');
          console.log('Image buffer size:', imageBuffer.length);
          
          // Validate file size (max 3MB)
          if (imageBuffer.length > 3 * 1024 * 1024) {
            console.error('Image too large:', imageBuffer.length);
            return res.status(413).json({
              message: 'Image size too large. Maximum 3MB allowed.'
            });
          }

          // Upload to Cloudinary
          console.log('Uploading to Cloudinary...');
          const uploadResult = await uploadToCloudinary(
            imageBuffer, 
            'announcements', 
            'image'
          );
          
          announcement.image_url = uploadResult.secure_url;
          announcement.cloudinary_public_id = uploadResult.public_id;
          announcement.caption = caption?.trim() || '';
          
          console.log('Cloudinary upload successful:', {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
          });

        } catch (uploadError: any) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({
            message: 'Failed to upload image to cloud storage',
            error: uploadError.message
          });
        }
      }

      console.log('Inserting announcement into database...');
      const result = await announcementsCollection.insertOne(announcement);
      
      console.log('Announcement created successfully:', result.insertedId);

      res.status(201).json({ 
        message: 'Announcement posted successfully',
        id: result.insertedId,
        announcement
      });

    } catch (error: any) {
      console.error('POST Error:', error);
      console.error('Error stack:', error.stack);
      
      res.status(500).json({ 
        message: 'Internal server error',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ 
      message: `Method ${req.method} not allowed` 
    });
  }
}