// /components/students/uploadassignment.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UploadAssignment() {
  const [formData, setFormData] = useState({
    student_name: '',
    usn: '',
    subject_name: '',
    section: '',
    branch: '',
    file_type: 'PDF',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (['usn', 'section', 'branch', 'subject_name'].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl('');
      }
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to convert file to base64'));
      reader.readAsDataURL(file);
    });
  };

  const validateForm = (): boolean => {
    if (!file) {
      toast.error('Please select a file to upload');
      return false;
    }

    // Validate file size (10MB limit for base64)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return false;
    }

    // Validate file type
    if (formData.file_type === 'PDF' && !file.type.includes('pdf')) {
      toast.error('Please select a PDF file');
      return false;
    }

    if (formData.file_type === 'Photo' && !file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG)');
      return false;
    }

    // Validate required fields
    if (!formData.student_name.trim()) {
      toast.error('Please enter your name');
      return false;
    }

    if (!formData.usn.trim() || formData.usn.length !== 10) {
      toast.error('Please enter a valid 10-character USN');
      return false;
    }

    if (!formData.subject_name.trim()) {
      toast.error('Please enter subject name');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Convert file to base64 for API
      console.log('Converting file to base64...');
      const file_data = await convertFileToBase64(file!);
      console.log('Base64 conversion successful, length:', file_data.length);

      const submitData = {
        ...formData,
        file_data,
        file_name: file!.name,
        file_size: file!.size,
      };

      console.log('Uploading to API...', {
        student: formData.student_name,
        usn: formData.usn,
        subject: formData.subject_name,
        file: file!.name,
        size: file!.size,
        base64_length: file_data.length
      });

      // Send to API route which will handle Cloudinary upload
      const response = await axios.post('/api/student-answers', submitData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 120000, // 2 minute timeout for large files
      });

      console.log('Upload successful:', response.data);
      
      toast.success('Assignment uploaded successfully! 🎉');

      // Reset form
      setFormData({
        student_name: '',
        usn: '',
        subject_name: '',
        section: '',
        branch: '',
        file_type: 'PDF',
      });
      setFile(null);
      setPreviewUrl('');
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Handle specific error cases
      if (error.code === 'ECONNABORTED') {
        toast.error('Upload timeout. Please try again with a smaller file.');
      } else if (error.response?.status === 413) {
        toast.error('File too large. Please select a file smaller than 10MB.');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid request data');
      } else if (error.response?.status === 500) {
        toast.error(error.response.data.message || 'Server error. Please try again.');
      } else if (error.message?.includes('Network Error')) {
        toast.error('Network error. Please check your connection.');
      } else if (error.message?.includes('Failed to convert')) {
        toast.error('Failed to process file. Please try again.');
      } else {
        toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h2 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent drop-shadow-md">
        Upload Assignment
      </h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Student Name', name: 'student_name', placeholder: 'Enter full name', type: 'text' },
            { label: 'USN', name: 'usn', placeholder: 'Enter your USN (10 characters)', type: 'text' },
            { label: 'Subject Name', name: 'subject_name', placeholder: 'e.g., DBMS', type: 'text' },
            { label: 'Section', name: 'section', placeholder: 'e.g., A', type: 'text' },
            { label: 'Branch', name: 'branch', placeholder: 'e.g., CSE', type: 'text' },
          ].map((input) => (
            <div key={input.name}>
              <label className="text-sm text-gray-300 block mb-1">{input.label} *</label>
              <input
                type={input.type}
                name={input.name}
                value={(formData as any)[input.name]}
                onChange={handleInputChange}
                placeholder={input.placeholder}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
                maxLength={input.name === 'usn' ? 10 : undefined}
              />
            </div>
          ))}

          <div>
            <label className="text-sm text-gray-300 block mb-1">File Type *</label>
            <select
              name="file_type"
              value={formData.file_type}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="PDF">PDF Document</option>
              <option value="Photo">Image (JPG, PNG)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-300 block mb-1">Upload File *</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                accept={formData.file_type === 'PDF' ? '.pdf' : 'image/*'}
                className="hidden"
                id="file-upload"
                required
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                📁 Choose File
              </label>
              <p className="text-gray-400 mt-2 text-sm">
                {formData.file_type === 'PDF' 
                  ? 'PDF files only (max 10MB)' 
                  : 'JPG, PNG images only (max 10MB)'
                }
              </p>
              
              {file && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        Size: {getFileSize(file.size)} • Type: {file.type}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl('');
                        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {previewUrl && formData.file_type === 'Photo' && (
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 shadow-md">
            <h3 className="text-lg font-bold text-blue-300 mb-3">Image Preview</h3>
            <div className="flex justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full rounded-lg border border-gray-700 shadow-md max-h-64 object-contain"
              />
            </div>
          </div>
        )}

        {file && formData.file_type === 'PDF' && (
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="text-blue-300 font-medium">PDF File Selected</p>
                <p className="text-blue-200 text-sm">
                  {file.name} ({getFileSize(file.size)})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Info */}
        <div className="p-4 bg-purple-900/30 border border-purple-700 rounded-lg">
          <h4 className="text-purple-300 font-semibold mb-2">📤 Upload Process</h4>
          <ul className="text-purple-200 text-sm space-y-1">
            <li>• File → Base64 → Cloudinary → MongoDB</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Secure cloud storage with Cloudinary</li>
            <li>• Fast global CDN delivery</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading to Cloudinary...</span>
            </div>
          ) : (
            '📤 Upload Assignment'
          )}
        </button>
      </form>
    </div>
  );
}