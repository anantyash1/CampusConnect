// /components/student/announcementview.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Announcement {
  _id: string;
  type: 'text' | 'image';
  content?: string;
  image_url?: string; // Cloudinary URL
  caption?: string;
  posted_by: string;
  timestamp: string;
}

export default function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
    } catch {
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <h2 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
        Announcements
      </h2>

      {announcements.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📢</div>
          <p className="text-gray-400 text-lg">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  announcement.type === 'text' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-purple-600 text-white'
                }`}>
                  {announcement.type.toUpperCase()}
                </span>
              </div>

              {/* Announcement Content */}
              {announcement.type === 'text' ? (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="relative w-full h-64 mb-3 rounded-lg overflow-hidden border border-gray-700">
                    {announcement.image_url ? (
                      <Image
                        src={announcement.image_url}
                        alt={announcement.caption || 'Announcement image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <p className="text-gray-500">Image not available</p>
                      </div>
                    )}
                  </div>
                  {announcement.caption && (
                    <div className="bg-gray-800/50 p-3 rounded-lg mt-2">
                      <p className="text-gray-300 italic">{announcement.caption}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}