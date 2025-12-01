// /pages/api/announcements/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
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
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDatabase();
  const announcementsCollection = db.collection('announcements');

  // ✅ GET: Fetch all announcements
  if (req.method === 'GET') {
    try {
      console.log('Fetching announcements...');
      const announcements = await announcementsCollection
        .find({})
        .sort({ timestamp: -1 })
        .toArray();

      console.log(`Found ${announcements.length} announcements`);
      
      // Transform data for consistency
      const transformedAnnouncements = announcements.map(announcement => ({
        _id: announcement._id,
        type: announcement.type,
        content: announcement.content || '',
        image_url: announcement.image_url || null,
        cloudinary_public_id: announcement.cloudinary_public_id || null,
        caption: announcement.caption || '',
        posted_by: announcement.posted_by || 'Unknown',
        timestamp: announcement.timestamp || new Date(),
      }));

      res.status(200).json(transformedAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ 
        message: 'Failed to fetch announcements',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  // ✅ POST: Teacher creates announcement (text or image)
  else if (req.method === 'POST') {
    try {
      console.log('Received announcement POST request');
      const { type, posted_by, content, caption, image_data } = req.body;

      console.log('Request data:', {
        type,
        posted_by,
        hasContent: !!content,
        hasImageData: !!image_data,
        imageDataLength: image_data?.length
      });

      // Validate required fields
      if (!type || !posted_by) {
        console.error('Missing required fields:', { type, posted_by });
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

      const announcement: any = {
        type,
        posted_by: posted_by.trim(),
        timestamp: new Date(),
      };

      if (type === 'text') {
        announcement.content = content.trim();
      } else if (type === 'image' && image_data) {
        try {
          console.log('Processing image upload to Cloudinary...');
          
          // Validate base64 format
          if (!image_data.startsWith('data:image/')) {
            console.error('Invalid image data format');
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
          
          // Validate file size (max 3MB for announcement images)
          if (imageBuffer.length > 3 * 1024 * 1024) {
            console.error('Image too large:', imageBuffer.length, 'bytes');
            return res.status(413).json({
              message: 'Image size too large. Maximum 3MB allowed.'
            });
          }

          // Upload to Cloudinary
          const uploadResult = await uploadToCloudinary(
            imageBuffer, 
            'announcements', 
            'image'
          );
          
          announcement.image_url = uploadResult.secure_url;
          announcement.cloudinary_public_id = uploadResult.public_id;
          announcement.caption = caption?.trim() || '';
          
          console.log('Image uploaded to Cloudinary successfully:', {
            image_url: uploadResult.secure_url,
            public_id: uploadResult.public_id
          });

        } catch (uploadError: any) {
          console.error('Cloudinary upload error:', uploadError);
          
          if (uploadError.message?.includes('File size too large')) {
            return res.status(413).json({
              message: 'Image size too large. Please select a smaller image.'
            });
          }
          
          return res.status(500).json({
            message: 'Failed to upload image to cloud storage',
            error: process.env.NODE_ENV === 'development' ? uploadError.message : undefined
          });
        }
      }

      console.log('Inserting announcement into database...');
      const result = await announcementsCollection.insertOne(announcement);
      
      console.log('Announcement created successfully:', {
        id: result.insertedId,
        type,
        posted_by,
        has_image: type === 'image'
      });

      res.status(201).json({ 
        message: 'Announcement posted successfully',
        id: result.insertedId,
        announcement: {
          ...announcement,
          _id: result.insertedId
        }
      });

    } catch (error: any) {
      console.error('Error saving announcement:', error);
      
      // Handle MongoDB errors
      if (error.name === 'MongoNetworkError') {
        return res.status(503).json({
          message: 'Database connection failed. Please try again.'
        });
      }
      
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // ❌ INVALID METHOD
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ 
      message: `Method ${req.method} not allowed. Use GET or POST.` 
    });
  }
}