// pages/api/test-config.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {}
  };

  // 1. Check MongoDB Connection
  try {
    console.log('Testing MongoDB connection...');
    const db = await getDatabase();
    await db.command({ ping: 1 });
    results.checks.mongodb = {
      status: 'SUCCESS',
      message: 'Connected to MongoDB',
      database: process.env.MONGODB_DB
    };
  } catch (error: any) {
    results.checks.mongodb = {
      status: 'FAILED',
      message: error.message,
      hasURI: !!process.env.MONGODB_URI,
      hasDB: !!process.env.MONGODB_DB
    };
  }

  // 2. Check Cloudinary Configuration
  try {
    console.log('Testing Cloudinary configuration...');
    const config = cloudinary.config();
    results.checks.cloudinary = {
      status: 'CONFIGURED',
      cloud_name: config.cloud_name,
      has_api_key: !!config.api_key,
      has_api_secret: !!config.api_secret,
      api_key_length: config.api_key?.length || 0
    };

    // Try a simple API call
    const pingResult = await cloudinary.api.ping();
    results.checks.cloudinary.api_status = 'SUCCESS';
    results.checks.cloudinary.ping = pingResult;
  } catch (error: any) {
    results.checks.cloudinary = {
      status: 'FAILED',
      message: error.message,
      has_cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
      has_api_key: !!process.env.CLOUDINARY_API_KEY,
      has_api_secret: !!process.env.CLOUDINARY_API_SECRET
    };
  }

  // 3. Check Environment Variables
  results.checks.environment = {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI_exists: !!process.env.MONGODB_URI,
    MONGODB_DB_exists: !!process.env.MONGODB_DB,
    CLOUDINARY_CLOUD_NAME_exists: !!process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY_exists: !!process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET_exists: !!process.env.CLOUDINARY_API_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  };

  // 4. Overall Status
  const allPassed = 
    results.checks.mongodb?.status === 'SUCCESS' &&
    results.checks.cloudinary?.api_status === 'SUCCESS';

  results.overall_status = allPassed ? 'ALL SYSTEMS OPERATIONAL' : 'ISSUES DETECTED';

  console.log('Configuration Test Results:', JSON.stringify(results, null, 2));

  res.status(200).json(results);
}