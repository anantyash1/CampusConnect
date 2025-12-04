// // /components/teacher/assignmentanswer.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// interface StudentAnswer {
//   _id: string;
//   student_name: string;
//   usn: string;
//   subject_name: string;
//   section: string;
//   branch: string;
//   file_type: string;
//   cloudinary_url: string;
//   upload_time: string;
//   file_name: string;
//   file_size: number;
// }

// export default function AssignmentAnswers() {
//   const [answers, setAnswers] = useState<StudentAnswer[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     branch: '',
//     section: '',
//     subject_name: ''
//   });

//   useEffect(() => {
//     fetchAnswers();
//   }, []);

//   const fetchAnswers = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filters.branch) params.append('branch', filters.branch);
//       if (filters.section) params.append('section', filters.section);
//       if (filters.subject_name) params.append('subject_name', filters.subject_name);

//       const response = await axios.get(`/api/student-answers?${params}`);
//       setAnswers(response.data);
//     } catch (error) {
//       console.error('Error fetching answers:', error);
//       toast.error('Failed to fetch student answers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const handleApplyFilters = () => {
//     fetchAnswers();
//   };

//   const handleClearFilters = () => {
//     setFilters({ branch: '', section: '', subject_name: '' });
//     fetchAnswers();
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getFileSize = (bytes: number): string => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
//       <h2 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
//         Student Assignment Answers
//       </h2>

//       {/* Filters */}
//       <div className="max-w-6xl mx-auto mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
//         <h3 className="text-xl font-semibold mb-4 text-blue-300">Filter Answers</h3>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="text-sm text-gray-300 block mb-1">Branch</label>
//             <input
//               type="text"
//               name="branch"
//               value={filters.branch}
//               onChange={handleFilterChange}
//               placeholder="e.g., CSE"
//               className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-300 block mb-1">Section</label>
//             <input
//               type="text"
//               name="section"
//               value={filters.section}
//               onChange={handleFilterChange}
//               placeholder="e.g., A"
//               className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-300 block mb-1">Subject</label>
//             <input
//               type="text"
//               name="subject_name"
//               value={filters.subject_name}
//               onChange={handleFilterChange}
//               placeholder="e.g., DBMS"
//               className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white"
//             />
//           </div>
//           <div className="flex items-end space-x-2">
//             <button
//               onClick={handleApplyFilters}
//               className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
//             >
//               Apply
//             </button>
//             <button
//               onClick={handleClearFilters}
//               className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition"
//             >
//               Clear
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Answers List */}
//       <div className="max-w-6xl mx-auto">
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-400">Loading student answers...</p>
//           </div>
//         ) : answers.length === 0 ? (
//           <div className="text-center py-12 bg-white/5 rounded-2xl">
//             <div className="text-6xl mb-4">📝</div>
//             <p className="text-gray-400 text-lg">No student answers found</p>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {answers.map((answer) => (
//               <div
//                 key={answer._id}
//                 className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
//               >
//                 <div className="flex flex-col md:flex-row md:items-center justify-between">
//                   <div className="flex-1">
//                     <h3 className="text-xl font-semibold text-white mb-2">
//                       {answer.student_name}
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
//                       <div>
//                         <span className="text-gray-400">USN:</span> {answer.usn}
//                       </div>
//                       <div>
//                         <span className="text-gray-400">Branch:</span> {answer.branch}
//                       </div>
//                       <div>
//                         <span className="text-gray-400">Section:</span> {answer.section}
//                       </div>
//                       <div>
//                         <span className="text-gray-400">Subject:</span> {answer.subject_name}
//                       </div>
//                       <div>
//                         <span className="text-gray-400">File Type:</span> {answer.file_type}
//                       </div>
//                       <div>
//                         <span className="text-gray-400">Size:</span> {getFileSize(answer.file_size)}
//                       </div>
//                       <div>
//                         <span className="text-gray-400">Uploaded:</span> {formatDate(answer.upload_time)}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-4 md:mt-0 md:ml-4">
//                     {answer.cloudinary_url ? (
//                       <a
//                         href={answer.cloudinary_url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-block"
//                       >
//                         View Answer
//                       </a>
//                     ) : (
//                       <span className="text-red-400">File not available</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // components/teacher/AssignmentAnswers.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// interface StudentAnswer {
//   _id: string;
//   student_name: string;
//   usn: string;
//   subject_name: string;
//   section: string;
//   branch: string;
//   file_type: string;
//   file_name: string;
//   file_size: number;
//   cloudinary_url: string;
//   cloudinary_public_id: string;
//   upload_time: string;
// }

// export default function AssignmentAnswers() {
//   const [answers, setAnswers] = useState<StudentAnswer[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     branch: '',
//     section: '',
//     subject_name: '',
//   });

//   useEffect(() => {
//     fetchAnswers();
//   }, []);

//   const fetchAnswers = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams();
//       if (filters.branch) queryParams.append('branch', filters.branch);
//       if (filters.section) queryParams.append('section', filters.section);
//       if (filters.subject_name) queryParams.append('subject_name', filters.subject_name);

//       const response = await axios.get(`/api/student-answers?${queryParams.toString()}`);
//       setAnswers(response.data);
//     } catch (error) {
//       console.error('Error fetching answers:', error);
//       toast.error('Failed to fetch student submissions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (key: keyof typeof filters, value: string) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const clearFilters = () => {
//     setFilters({ branch: '', section: '', subject_name: '' });
//     fetchAnswers();
//   };

//   const getFileSize = (bytes: number): string => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const getFileIcon = (type: string) => {
//     if (type === 'PDF') return '📄';
//     if (type === 'PHOTO' || type === 'IMAGE') return '🖼️';
//     return '📁';
//   };

//   return (
//     <div className="text-white p-6">
//       <h2 className="text-3xl font-bold mb-6 text-green-300">Student Assignment Submissions</h2>

//       {/* Filters */}
//       <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md mb-6">
//         <h3 className="text-xl font-bold text-green-400 mb-4">Filter Submissions</h3>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="text-sm text-gray-300 block mb-1">Branch</label>
//             <input
//               type="text"
//               value={filters.branch}
//               onChange={(e) => handleFilterChange('branch', e.target.value)}
//               placeholder="e.g., CSE"
//               className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-300 block mb-1">Section</label>
//             <input
//               type="text"
//               value={filters.section}
//               onChange={(e) => handleFilterChange('section', e.target.value)}
//               placeholder="e.g., A"
//               className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-300 block mb-1">Subject</label>
//             <input
//               type="text"
//               value={filters.subject_name}
//               onChange={(e) => handleFilterChange('subject_name', e.target.value)}
//               placeholder="e.g., DBMS"
//               className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//             />
//           </div>
//           <div className="flex items-end gap-2">
//             <button
//               onClick={fetchAnswers}
//               disabled={loading}
//               className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
//             >
//               {loading ? 'Filtering...' : 'Apply Filters'}
//             </button>
//             <button
//               onClick={clearFilters}
//               className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
//             >
//               Clear
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Results */}
//       {loading ? (
//         <div className="flex justify-center items-center h-40">
//           <div className="w-10 h-10 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
//         </div>
//       ) : answers.length === 0 ? (
//         <div className="text-center text-gray-400 bg-gray-800 p-8 rounded-xl border border-gray-700">
//           <p className="text-lg mb-2">No student submissions found.</p>
//           <p className="text-sm">Try adjusting your filters or check back later.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="text-gray-300">
//             Showing {answers.length} submission(s)
//           </div>
          
//           {answers.map((answer) => (
//             <div
//               key={answer._id}
//               className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md hover:bg-gray-750 transition"
//             >
//               <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
//                 <div className="flex-1">
//                   <h3 className="text-xl font-semibold text-green-400 mb-2">
//                     {answer.student_name} ({answer.usn})
//                   </h3>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
//                     <div><strong>📘 Subject:</strong> {answer.subject_name}</div>
//                     <div><strong>🏛️ Branch:</strong> {answer.branch}</div>
//                     <div><strong>📚 Section:</strong> {answer.section}</div>
//                     <div><strong>📦 File:</strong> {getFileSize(answer.file_size)}</div>
//                     <div><strong>📄 Type:</strong> {answer.file_type}</div>
//                     <div><strong>🕓 Submitted:</strong> {new Date(answer.upload_time).toLocaleString()}</div>
//                   </div>
//                 </div>
                
//                 <div className="flex flex-wrap gap-2">
//                   <a
//                     href={answer.cloudinary_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
//                   >
//                     {getFileIcon(answer.file_type)} View Submission
//                   </a>
//                   <a
//                     href={answer.cloudinary_url}
//                     download={`${answer.student_name}_${answer.subject_name}_${answer.usn}.${answer.file_type.toLowerCase()}`}
//                     className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
//                   >
//                     📥 Download
//                   </a>
//                 </div>
//               </div>

//               {/* File Info */}
//               <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
//                 <p className="text-sm text-gray-400">
//                   <strong>File:</strong> {answer.file_name} • {getFileSize(answer.file_size)} • 
//                   <a 
//                     href={answer.cloudinary_url} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-blue-300 hover:underline ml-2"
//                   >
//                     Cloudinary Link
//                   </a>
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// components/teacher/AssignmentAnswers.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface StudentAnswer {
  _id: string;
  student_name: string;
  usn: string;
  subject_name: string;
  section: string;
  branch: string;
  file_type: string;
  file_name: string;
  file_size: number;
  cloudinary_url: string;
  cloudinary_public_id: string;
  upload_time: string;
}

export default function AssignmentAnswers() {
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    branch: '',
    section: '',
    subject_name: '',
  });

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    setLoading(true);
    try {
      console.log('📥 Fetching student answers...');
      const queryParams = new URLSearchParams();
      if (filters.branch) queryParams.append('branch', filters.branch);
      if (filters.section) queryParams.append('section', filters.section);
      if (filters.subject_name) queryParams.append('subject_name', filters.subject_name);

      const url = `/api/student-answers?${queryParams.toString()}`;
      console.log('API URL:', url);
      
      const response = await axios.get(url);
      console.log('📊 API Response:', {
        status: response.status,
        dataCount: response.data?.length || 0,
        data: response.data
      });
      
      setAnswers(response.data || []);
      
      if (response.data?.length === 0) {
        toast('No submissions found', {
          icon: 'ℹ️',
          style: { background: '#2563eb', color: 'white' },
        });
      } else {
        toast.success(`Found ${response.data?.length || 0} submission(s)`);
      }
    } catch (error: any) {
      console.error('❌ Error fetching answers:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch student submissions');
      setAnswers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ branch: '', section: '', subject_name: '' });
    fetchAnswers();
  };

  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'PDF') return '📄';
    if (type === 'PHOTO' || type === 'IMAGE') return '🖼️';
    return '📁';
  };

  // Function to handle file download
  const handleDownload = async (answer: StudentAnswer) => {
    if (!answer.cloudinary_url) {
      toast.error('File not available for download');
      return;
    }

    try {
      toast.loading('Preparing download...', { id: 'download' });
      
      // Fetch the file
      const response = await fetch(answer.cloudinary_url);
      const blob = await response.blob();
      
      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Set filename
      const fileExtension = answer.file_type.toLowerCase() === 'photo' ? 'jpg' : answer.file_type.toLowerCase();
      const fileName = `${answer.student_name}_${answer.subject_name}_${answer.usn}.${fileExtension}`;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success(`Downloading: ${fileName}`, { id: 'download' });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file', { id: 'download' });
    }
  };

  // Function to handle view
  const handleView = (answer: StudentAnswer) => {
    if (!answer.cloudinary_url) {
      toast.error('File not available for viewing');
      return;
    }

    // For PDFs, use Google Docs viewer
    if (answer.file_type === 'PDF') {
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(answer.cloudinary_url)}&embedded=true`;
      window.open(googleViewerUrl, '_blank', 'noopener,noreferrer');
    } else {
      // For images, open directly
      window.open(answer.cloudinary_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-green-300">Student Assignment Submissions</h2>

      {/* Debug Info */}
      <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded text-sm text-blue-300">
        💡 <strong>Debug Info:</strong> Fetching from <code>/api/student-answers</code>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md mb-6">
        <h3 className="text-xl font-bold text-green-400 mb-4">Filter Submissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Branch</label>
            <input
              type="text"
              value={filters.branch}
              onChange={(e) => handleFilterChange('branch', e.target.value.toUpperCase())}
              placeholder="e.g., CSE"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Section</label>
            <input
              type="text"
              value={filters.section}
              onChange={(e) => handleFilterChange('section', e.target.value.toUpperCase())}
              placeholder="e.g., A"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Subject</label>
            <input
              type="text"
              value={filters.subject_name}
              onChange={(e) => handleFilterChange('subject_name', e.target.value.toUpperCase())}
              placeholder="e.g., DBMS"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={fetchAnswers}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-t-green-500 border-gray-700 rounded-full animate-spin"></div>
        </div>
      ) : answers.length === 0 ? (
        <div className="text-center text-gray-400 bg-gray-800 p-8 rounded-xl border border-gray-700">
          <p className="text-lg mb-2">No student submissions found.</p>
          <p className="text-sm mb-4">Try adjusting your filters or check back later.</p>
          <div className="text-sm text-blue-300 bg-blue-900/30 p-3 rounded border border-blue-700">
            <p><strong>💡 Troubleshooting:</strong></p>
            <p>1. Check if students have uploaded assignments</p>
            <p>2. Verify the API endpoint: <code>/api/student-answers</code></p>
            <p>3. Check browser console for errors</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-gray-300">
              Showing {answers.length} submission(s)
            </div>
            <button
              onClick={fetchAnswers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
            >
              🔄 Refresh
            </button>
          </div>
          
          {answers.map((answer) => (
            <div
              key={answer._id}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md hover:bg-gray-750 transition"
            >
              <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-green-400 mb-2">
                    {answer.student_name} ({answer.usn})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
                    <div><strong>📘 Subject:</strong> {answer.subject_name}</div>
                    <div><strong>🏛️ Branch:</strong> {answer.branch}</div>
                    <div><strong>📚 Section:</strong> {answer.section}</div>
                    <div><strong>📦 File Size:</strong> {getFileSize(answer.file_size)}</div>
                    <div><strong>📄 Type:</strong> {answer.file_type}</div>
                    <div><strong>🕓 Submitted:</strong> {new Date(answer.upload_time).toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleView(answer)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
                  >
                    {getFileIcon(answer.file_type)} View
                  </button>
                  <button
                    onClick={() => handleDownload(answer)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
                  >
                    📥 Download
                  </button>
                </div>
              </div>

              {/* File Info */}
              <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">
                  <strong>File:</strong> {answer.file_name} • {getFileSize(answer.file_size)} • 
                  <span className="ml-2 text-green-300">
                    Cloudinary: {answer.cloudinary_url ? '✅ Available' : '❌ Missing'}
                  </span>
                </p>
                {answer.cloudinary_url && (
                  <p className="text-sm text-gray-400 mt-1 break-all">
                    <strong>URL:</strong> {answer.cloudinary_url.substring(0, 80)}...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}