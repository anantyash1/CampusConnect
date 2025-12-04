// /components/teacher/announcements.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface AnnouncementsProps {
  username: string;
}

interface Announcement {
  _id: string;
  type: 'text' | 'image';
  content?: string;
  image_url?: string;
  caption?: string;
  posted_by: string;
  timestamp: string;
}

export default function Announcements({ username }: AnnouncementsProps) {
  const [type, setType] = useState<'text' | 'image'>('text');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  // Convert image to base64 for API
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to convert image to base64'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPG, PNG, etc.)');
        setImage(null);
        return;
      }

      // Validate file size (max 3MB)
      if (file.size > 3 * 1024 * 1024) {
        toast.error('Image size must be less than 3MB');
        setImage(null);
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview('');
    }
  };

  // components/teacher/Announcements.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (type === 'text' && !content.trim()) {
      toast.error('Please enter announcement content');
      return;
    }

    if (type === 'image' && !image) {
      toast.error('Please select an image');
      return;
    }

    setSubmitting(true);

    try {
      const announcementData: any = {
        type,
        posted_by: username,
      };

      if (type === 'text') {
        announcementData.content = content.trim();
      } else if (type === 'image' && image) {
        try {
          console.log('Converting image to base64...'); // DEBUG
          const image_data = await convertImageToBase64(image);
          console.log('Base64 length:', image_data.length); // DEBUG
          announcementData.image_data = image_data;
          announcementData.caption = caption.trim();
        } catch (error) {
          console.error('Base64 conversion error:', error); // DEBUG
          toast.error('Failed to process image. Please try again.');
          setSubmitting(false);
          return;
        }
      }

      console.log('Posting announcement...', { type, posted_by: username }); // DEBUG
      const response = await axios.post('/api/announcements', announcementData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      console.log('Success response:', response.data); // DEBUG
      toast.success('Announcement posted successfully! 🎉');

      // Reset form
      setContent('');
      setImage(null);
      setCaption('');
      setImagePreview('');
      setType('text');

      // Refresh announcements
      fetchAnnouncements();

    } catch (error: any) {
      console.error('Full error object:', error); // DEBUG
      console.error('Error response:', error.response); // DEBUG
      console.error('Error message:', error.message); // DEBUG

      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const message = error.response.data?.message || 'Server error';
        console.error(`Server error ${status}:`, message); // DEBUG
        toast.error(`Error: ${message}`);
      } else if (error.request) {
        // Request made but no response
        console.error('No response received:', error.request); // DEBUG
        toast.error('Network error. Please check your connection.');
      } else {
        // Something else happened
        console.error('Error:', error.message); // DEBUG
        toast.error(error.message || 'Failed to post announcement');
      }
    } finally {
      setSubmitting(false);
    }
  };


  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6">Announcements</h2>

      {/* Post Announcement Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl border border-gray-600 shadow-md mb-8"
      >
        <h3 className="text-xl font-semibold mb-4 text-blue-400">Create New Announcement</h3>

        <div className="mb-4">
          <label className="text-sm text-gray-300 block mb-2">Announcement Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="text"
                checked={type === 'text'}
                onChange={(e) => setType(e.target.value as 'text' | 'image')}
                className="mr-2"
              />
              Text Announcement
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="image"
                checked={type === 'image'}
                onChange={(e) => setType(e.target.value as 'text' | 'image')}
                className="mr-2"
              />
              Image Announcement
            </label>
          </div>
        </div>

        {type === 'text' ? (
          <div className="mb-4">
            <label className="text-sm text-gray-300 block mb-2">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your announcement content..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              rows={4}
              required
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 block mb-2">Upload Image *</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
                accept="image/*"
                required
              />
              {image && (
                <p className="text-sm text-gray-400 mt-1">
                  Selected: {image.name} ({(image.size / 1024).toFixed(2)} KB)
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Maximum file size: 3MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-2">Caption (Optional)</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption for the image..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300 mb-2">Preview:</p>
                <div className="relative w-full h-48 rounded overflow-hidden border border-gray-600">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onLoad={() => URL.revokeObjectURL(imagePreview)} // Clean up blob URL
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {submitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Posting...
            </div>
          ) : (
            'Post Announcement'
          )}
        </button>

        <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded text-sm text-green-300">
          ☁️ <strong>Cloudinary Storage:</strong> Images are stored securely in cloud storage.
        </div>
      </form>

      {/* Previous Announcements Section */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4 text-blue-400">Previous Announcements</h3>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-400">Loading announcements...</p>
            </div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-600">
            <div className="text-6xl mb-4">📢</div>
            <p className="text-gray-400 text-lg">No announcements yet</p>
            <p className="text-gray-500 text-sm mt-1">Be the first to post an announcement!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="bg-gray-800 border border-gray-600 rounded-xl p-6 shadow-md hover:bg-gray-700/60 transition-all duration-300"
              >
                {/* Announcement Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {announcement.posted_by}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {formatDate(announcement.timestamp)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${announcement.type === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-purple-600 text-white'
                    }`}>
                    {announcement.type.toUpperCase()}
                  </span>
                </div>

                {/* Announcement Content */}
                {announcement.type === 'text' ? (
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {announcement.content}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="relative w-full h-64 mb-3 rounded-lg overflow-hidden border border-gray-700 bg-black/20">
                      {announcement.image_url ? (
                        <Image
                          src={announcement.image_url}
                          alt={announcement.caption || 'Announcement image'}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          onError={(e) => {
                            console.error('Failed to load announcement image');
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                          <p className="text-gray-500">Image not available</p>
                        </div>
                      )}
                    </div>
                    {announcement.caption && (
                      <div className="bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-gray-300 italic">{announcement.caption}</p>
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500 text-right">
                      ☁️ Cloudinary Storage
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}