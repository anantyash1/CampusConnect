// /lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.warn('⚠️ Cloudinary cloud name is missing');
}

if (!process.env.CLOUDINARY_API_KEY) {
  console.warn('⚠️ Cloudinary API key is missing');
}

if (!process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠️ Cloudinary API secret is missing');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Upload file to Cloudinary
export const uploadToCloudinary = async (
  fileBuffer: Buffer, 
  folder: string, 
  resourceType: 'image' | 'raw' = 'image'
): Promise<{secure_url: string; public_id: string; format: string; bytes: number}> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format || (resourceType === 'raw' ? 'pdf' : 'jpg'),
            bytes: result.bytes || fileBuffer.length
          });
        } else {
          reject(new Error('No result from Cloudinary'));
        }
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

// Delete from Cloudinary
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "raw" | "video" = "image"
) {
  return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}