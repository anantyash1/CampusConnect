// lib/upload-config.ts - DELETE THIS FILE OR REPLACE WITH:
// This file is deprecated - all uploads now use Cloudinary

export const CLOUDINARY_FOLDERS = {
  STUDENT_PHOTOS: 'student-photos',
  ANNOUNCEMENTS: 'announcements',
  ASSIGNMENT_QUESTIONS: 'assignment-questions',
  STUDENT_ASSIGNMENTS: 'student-assignments',
} as const;

export const MAX_FILE_SIZES = {
  PHOTO: 2 * 1024 * 1024, // 2MB for photos
  IMAGE: 3 * 1024 * 1024, // 3MB for images
  DOCUMENT: 10 * 1024 * 1024, // 10MB for PDFs
} as const;