export const isVercel = process.env.VERCEL === '1';

export const getUploadConfig = () => {
  if (isVercel) {
    return {
      storage: 'mongodb', // or 'cloud-storage'
      maxFileSize: 20 * 1024 * 1024, // 20MB
    };
  }
  
  return {
    storage: 'local',
    uploadDir: './public/uploads',
    maxFileSize: 20 * 1024 * 1024,
  };
};