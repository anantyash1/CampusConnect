// /types/index.ts

// User authentication
export interface User {
  _id?: string;
  username: string;
  password?: string;
  role: 'teacher' | 'student';
  createdAt?: Date;
}

// Student information
export interface Student {
  _id?: string;
  usn: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  mobile: string;
  branch: string;
  current_sem: number;
  academic_year: string;
  '12_percentage': number;
  '10_percentage': number;
  // Old field - for backward compatibility
  photo?: boolean;
  // New fields - Cloudinary storage
  photo_url?: string;
  cloudinary_public_id?: string;
  createdAt?: Date;
}

// Marks/Grades for subjects
export interface Assignment {
  _id?: string;
  usn: string;
  assignment: string;
  dbms: number;
  daa: number;
  microcontroller: number;
  maths: number;
  uhv: number;
  biology: number;
}

// Grades interface
export interface Grades {
  [subject: string]: number | undefined;
  sgpa?: number;
  rank?: number;
}

// Semester results
export interface Result {
  _id?: string;
  usn: string;
  semester: string;
  grades: Grades;
  createdAt?: Date;
}

// Attendance tracking
export interface AttendanceSubject {
  attended: number;
  total: number;
}

export interface Attendance {
  _id?: string;
  usn: string;
  semester: string;
  subjects: {
    [subject: string]: AttendanceSubject;
  };
  createdAt?: Date;
}

// Announcements with Cloudinary support
export interface Announcement {
  _id?: string;
  type: 'text' | 'image';
  content?: string;
  // Old field - local storage (deprecated)
  image_path?: string;
  // New fields - Cloudinary storage
  image_url?: string;
  cloudinary_public_id?: string;
  caption?: string;
  posted_by: string;
  timestamp: Date;
}

// Assignment questions with Cloudinary support
export interface AssignmentQuestion {
  _id?: string;
  teacher_name: string;
  subject_name: string;
  semester: string;
  assignment_title: string;
  assignment_type: 'PDF' | 'Photo';
  // Old field - local storage (deprecated)
  assignment_file?: Buffer;
  // New fields - Cloudinary storage
  cloudinary_url: string;
  cloudinary_public_id?: string;
  file_name: string;
  file_size: number;
  upload_time: Date;
}

// Student answers with Cloudinary support
export interface StudentAnswer {
  _id?: string;
  student_name: string;
  usn: string;
  subject_name: string;
  section: string;
  branch: string;
  file_type: 'PDF' | 'Photo';
  // Old field - local storage (deprecated)
  file_data?: string; // Base64 string for fallback
  // New fields - Cloudinary storage
  cloudinary_url?: string;
  cloudinary_public_id?: string;
  cloudinary_format?: string;
  storage_type?: 'cloudinary' | 'base64';
  file_name: string;
  file_size: number;
  upload_time: Date;
}

// Optional: Cloudinary upload response type
export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  resource_type: 'image' | 'raw';
}

// Optional: File upload state
export interface UploadState {
  loading: boolean;
  progress: number;
  error?: string;
  success?: boolean;
  url?: string;
}

// Optional: Filter types for queries
export interface StudentFilter {
  branch?: string;
  section?: string;
  semester?: string;
  usn?: string;
}

export interface AssignmentFilter {
  teacher_name?: string;
  subject_name?: string;
  semester?: string;
  assignment_type?: 'PDF' | 'Photo';
}

export interface AnnouncementFilter {
  type?: 'text' | 'image';
  posted_by?: string;
  startDate?: Date;
  endDate?: Date;
}