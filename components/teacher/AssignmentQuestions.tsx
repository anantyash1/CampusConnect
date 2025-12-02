// // /components/teacher/assignmentquestion.tsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// export default function AssignmentQuestions() {
//   const [action, setAction] = useState<'Upload' | 'Delete' | 'View All'>('Upload');
//   const [formData, setFormData] = useState({
//     teacher_name: '',
//     subject_name: '',
//     semester: '',
//     assignment_title: '',
//     assignment_type: 'PDF',
//   });
//   const [file, setFile] = useState<File | null>(null);
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [deleteTeacherName, setDeleteTeacherName] = useState('');

//   useEffect(() => {
//     if (action === 'View All') fetchQuestions();
//   }, [action]);

//   const fetchQuestions = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('/api/assignment-questions');
//       setQuestions(response.data.reverse());
//     } catch {
//       toast.error('Failed to fetch assignment questions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
//   };

//   const convertFileToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!file) return toast.error('Please select a file to upload');
//     if (file.size > 10 * 1024 * 1024) return toast.error('File size must be under 10MB');

//     setLoading(true);
    
//     try {
//       // Convert file to base64
//       const file_data = await convertFileToBase64(file);
      
//       const uploadData = {
//         ...formData,
//         file_data,
//         file_name: file.name
//       };

//       await axios.post('/api/assignment-questions', uploadData, {
//         headers: { 'Content-Type': 'application/json' },
//       });
      
//       toast.success('Assignment uploaded successfully');
      
//       // Reset form
//       setFormData({
//         teacher_name: '',
//         subject_name: '',
//         semester: '',
//         assignment_title: '',
//         assignment_type: 'PDF',
//       });
//       setFile(null);
      
//     } catch (error: any) {
//       console.error('Upload error:', error);
//       toast.error(error.response?.data?.message || 'Upload failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAll = async () => {
//     if (!deleteTeacherName) return toast.error('Enter teacher name');
//     if (!confirm(`Delete all assignments by ${deleteTeacherName}?`)) return;

//     setLoading(true);
//     try {
//       await axios.delete(`/api/assignment-questions?teacher_name=${encodeURIComponent(deleteTeacherName)}`);
//       toast.success('All assignments deleted successfully');
//       setDeleteTeacherName('');
//       fetchQuestions();
//     } catch {
//       toast.error('Failed to delete');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteOne = async (id: string) => {
//     if (!confirm('Delete this assignment question?')) return;
//     setLoading(true);
//     try {
//       await axios.delete(`/api/assignment-questions?id=${id}`);
//       toast.success('Assignment deleted');
//       fetchQuestions();
//     } catch {
//       toast.error('Failed to delete assignment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFileSize = (bytes: number): string => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   return (
//     <div className="text-white">
//       <h2 className="text-3xl font-bold mb-6">Assignment Questions</h2>

//       {/* Action Buttons */}
//       <div className="mb-6 flex gap-4 flex-wrap">
//         {(['Upload', 'Delete', 'View All'] as const).map((option) => (
//           <button
//             key={option}
//             onClick={() => setAction(option)}
//             className={`px-6 py-2 rounded-lg font-medium transition ${
//               action === option
//                 ? 'bg-blue-600 text-white shadow-md'
//                 : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//             }`}
//           >
//             {option}
//           </button>
//         ))}
//       </div>

//       {/* Upload Section */}
//       {action === 'Upload' && (
//         <form
//           onSubmit={handleUpload}
//           className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md space-y-4"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//               { name: 'teacher_name', label: 'Teacher Name', placeholder: 'Enter teacher name' },
//               { name: 'subject_name', label: 'Subject Name', placeholder: 'e.g., DBMS' },
//               { name: 'semester', label: 'Semester', placeholder: 'e.g., Semester 4' },
//               { name: 'assignment_title', label: 'Assignment Title', placeholder: 'e.g., Assignment 1' },
//             ].map((field) => (
//               <div key={field.name}>
//                 <label className="text-sm text-gray-300 block mb-1">{field.label} *</label>
//                 <input
//                   type="text"
//                   name={field.name}
//                   value={(formData as any)[field.name]}
//                   onChange={handleInputChange}
//                   placeholder={field.placeholder}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//                   required
//                 />
//               </div>
//             ))}

//             <div>
//               <label className="text-sm text-gray-300 block mb-1">Assignment Type *</label>
//               <select
//                 name="assignment_type"
//                 value={formData.assignment_type}
//                 onChange={handleInputChange}
//                 className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//               >
//                 <option value="PDF">PDF</option>
//                 <option value="Photo">Photo</option>
//               </select>
//             </div>

//             <div>
//               <label className="text-sm text-gray-300 block mb-1">Upload File *</label>
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 accept={formData.assignment_type === 'PDF' ? '.pdf' : 'image/*'}
//                 className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//                 required
//               />
//               {file && (
//                 <p className="text-sm text-gray-400 mt-2">
//                   Selected: {file.name} ({getFileSize(file.size)})
//                 </p>
//               )}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
//           >
//             {loading ? 'Uploading...' : 'Upload Assignment'}
//           </button>
//         </form>
//       )}

//       {/* Delete Section */}
//       {action === 'Delete' && (
//         <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md space-y-6">
//           <div>
//             <h3 className="text-xl font-bold text-blue-400 mb-4">Delete All by Teacher Name</h3>
//             <div className="flex gap-4 flex-col md:flex-row">
//               <input
//                 type="text"
//                 value={deleteTeacherName}
//                 onChange={(e) => setDeleteTeacherName(e.target.value)}
//                 placeholder="Enter teacher name"
//                 className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//               />
//               <button
//                 onClick={handleDeleteAll}
//                 disabled={loading}
//                 className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
//               >
//                 {loading ? 'Deleting...' : 'Delete All'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View All Section */}
//       {action === 'View All' && (
//         <div className="space-y-6">
//           {loading ? (
//             <div className="flex justify-center items-center h-40">
//               <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
//             </div>
//           ) : questions.length === 0 ? (
//             <p className="text-gray-400 bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
//               No assignment questions found.
//             </p>
//           ) : (
//             questions.map((q) => (
//               <div
//                 key={q._id}
//                 className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="text-xl font-semibold text-blue-400">{q.assignment_title}</h3>
//                     <p className="text-sm text-gray-400 mt-1">
//                       <b>Teacher:</b> {q.teacher_name} | <b>Subject:</b> {q.subject_name} |{' '}
//                       <b>Semester:</b> {q.semester}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       <b>Type:</b> {q.assignment_type} |{' '}
//                       <b>Uploaded:</b> {new Date(q.upload_time).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleDeleteOne(q._id)}
//                     className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg font-semibold"
//                   >
//                     Delete
//                   </button>
//                 </div>

//                 {/* Cloudinary File Link */}
//                 {q.cloudinary_url ? (
//                   <div className="mt-4">
//                     <a
//                       href={q.cloudinary_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold inline-block"
//                     >
//                       View Assignment
//                     </a>
//                     <p className="text-sm text-gray-400 mt-2">
//                       File: {q.file_name} ({getFileSize(q.file_size)})
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="mt-4 p-4 bg-red-900/40 border border-red-700 text-red-300 rounded-lg">
//                     ⚠️ File not found
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }





// components/teacher/AssignmentQuestions.tsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// interface AssignmentQuestion {
//   _id: string;
//   assignment_title: string;
//   teacher_name: string;
//   subject_name: string;
//   semester: string;
//   assignment_type: string;
//   cloudinary_url: string;
//   cloudinary_public_id: string;
//   file_name: string;
//   file_size: number;
//   upload_time: string;
// }

// export default function AssignmentQuestions() {
//   const [action, setAction] = useState<'Upload' | 'Delete' | 'View All' | 'Search'>('Upload');
//   const [formData, setFormData] = useState({
//     teacher_name: '',
//     subject_name: '',
//     semester: '',
//     assignment_title: '',
//     assignment_type: 'PDF',
//   });
//   const [file, setFile] = useState<File | null>(null);
//   const [questions, setQuestions] = useState<AssignmentQuestion[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [deleteTeacherName, setDeleteTeacherName] = useState('');
  
//   // Search filters
//   const [searchTeacher, setSearchTeacher] = useState('');
//   const [searchSubject, setSearchSubject] = useState('');
//   const [searchSemester, setSearchSemester] = useState('');

//   useEffect(() => {
//     if (action === 'View All' || action === 'Search') {
//       fetchQuestions();
//     }
//   }, [action]);

//   const fetchQuestions = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('/api/assignment-questions');
//       let filteredQuestions = response.data.reverse();
      
//       // Apply search filters if in Search mode
//       if (action === 'Search') {
//         filteredQuestions = filteredQuestions.filter((q: AssignmentQuestion) => {
//           let matches = true;
//           if (searchTeacher) {
//             matches = matches && q.teacher_name.toLowerCase().includes(searchTeacher.toLowerCase());
//           }
//           if (searchSubject) {
//             matches = matches && q.subject_name.toLowerCase().includes(searchSubject.toLowerCase());
//           }
//           if (searchSemester) {
//             matches = matches && q.semester.toLowerCase().includes(searchSemester.toLowerCase());
//           }
//           return matches;
//         });
//       }
      
//       setQuestions(filteredQuestions);
//     } catch {
//       toast.error('Failed to fetch assignment questions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const convertFileToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (reader.result) {
//           resolve(reader.result as string);
//         } else {
//           reject(new Error('Failed to read file'));
//         }
//       };
//       reader.onerror = () => reject(new Error('Failed to convert file to base64'));
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!file) {
//       toast.error('Please select a file to upload');
//       return;
//     }
    
//     if (file.size > 10 * 1024 * 1024) {
//       toast.error('File size must be under 10MB');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Convert file to base64
//       console.log('Converting file to base64...', file.name, file.size);
//       const file_data = await convertFileToBase64(file);
//       console.log('Base64 conversion successful, length:', file_data.length);
      
//       const uploadData = {
//         ...formData,
//         file_data,
//         file_name: file.name,
//         file_size: file.size
//       };

//       console.log('Uploading to API...', {
//         teacher: formData.teacher_name,
//         subject: formData.subject_name,
//         semester: formData.semester,
//         title: formData.assignment_title,
//         file: file.name,
//         size: file.size,
//         base64_length: file_data.length
//       });

//       await axios.post('/api/assignment-questions', uploadData, {
//         headers: { 'Content-Type': 'application/json' },
//         timeout: 120000, // 2 minute timeout for large files
//       });
      
//       toast.success('Assignment uploaded successfully! 🎉');
      
//       // Reset form
//       setFormData({
//         teacher_name: '',
//         subject_name: '',
//         semester: '',
//         assignment_title: '',
//         assignment_type: 'PDF',
//       });
//       setFile(null);
      
//       // Refresh the list
//       fetchQuestions();
      
//     } catch (error: any) {
//       console.error('Upload error:', error);
      
//       // Handle specific error cases
//       if (error.code === 'ECONNABORTED') {
//         toast.error('Upload timeout. Please try again with a smaller file.');
//       } else if (error.response?.status === 413) {
//         toast.error('File too large. Please select a file smaller than 10MB.');
//       } else if (error.response?.status === 400) {
//         toast.error(error.response.data.message || 'Invalid request data');
//       } else if (error.response?.status === 500) {
//         toast.error(error.response.data.message || 'Server error. Please try again.');
//       } else if (error.message?.includes('Network Error')) {
//         toast.error('Network error. Please check your connection.');
//       } else if (error.message?.includes('Failed to convert')) {
//         toast.error('Failed to process file. Please try again.');
//       } else {
//         toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAll = async () => {
//     if (!deleteTeacherName) {
//       toast.error('Enter teacher name');
//       return;
//     }
    
//     if (!confirm(`Delete all assignments by ${deleteTeacherName}? This action cannot be undone.`)) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.delete(`/api/assignment-questions?teacher_name=${encodeURIComponent(deleteTeacherName)}`);
//       toast.success('All assignments deleted successfully');
//       setDeleteTeacherName('');
//       fetchQuestions();
//     } catch (error: any) {
//       console.error('Delete error:', error);
//       toast.error(error.response?.data?.message || 'Failed to delete assignments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteOne = async (id: string) => {
//     if (!confirm('Delete this assignment question? This action cannot be undone.')) return;
    
//     setLoading(true);
//     try {
//       await axios.delete(`/api/assignment-questions?id=${id}`);
//       toast.success('Assignment deleted successfully');
//       fetchQuestions();
//     } catch (error: any) {
//       console.error('Delete error:', error);
//       toast.error(error.response?.data?.message || 'Failed to delete assignment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFileSize = (bytes: number): string => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const clearSearch = () => {
//     setSearchTeacher('');
//     setSearchSubject('');
//     setSearchSemester('');
//     fetchQuestions();
//   };

//   return (
//     <div className="text-white p-6">
//       <h2 className="text-3xl font-bold mb-6 text-blue-300">Assignment Questions Management</h2>

//       {/* Action Buttons */}
//       <div className="mb-6 flex gap-3 flex-wrap">
//         {(['Upload', 'Search', 'View All', 'Delete'] as const).map((option) => (
//           <button
//             key={option}
//             onClick={() => setAction(option)}
//             className={`px-6 py-2 rounded-lg font-medium transition ${
//               action === option
//                 ? 'bg-blue-600 text-white shadow-md'
//                 : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//             }`}
//           >
//             {option}
//           </button>
//         ))}
//       </div>

//       {/* Upload Section */}
//       {action === 'Upload' && (
//         <form
//           onSubmit={handleUpload}
//           className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md space-y-4"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//               { name: 'teacher_name', label: 'Teacher Name', placeholder: 'Enter teacher name' },
//               { name: 'subject_name', label: 'Subject Name', placeholder: 'e.g., DBMS' },
//               { name: 'semester', label: 'Semester', placeholder: 'e.g., Semester 4' },
//               { name: 'assignment_title', label: 'Assignment Title', placeholder: 'e.g., Assignment 1' },
//             ].map((field) => (
//               <div key={field.name}>
//                 <label className="text-sm text-gray-300 block mb-1">{field.label} *</label>
//                 <input
//                   type="text"
//                   name={field.name}
//                   value={(formData as any)[field.name]}
//                   onChange={handleInputChange}
//                   placeholder={field.placeholder}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   required
//                 />
//               </div>
//             ))}

//             <div>
//               <label className="text-sm text-gray-300 block mb-1">Assignment Type *</label>
//               <select
//                 name="assignment_type"
//                 value={formData.assignment_type}
//                 onChange={handleInputChange}
//                 className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//               >
//                 <option value="PDF">PDF</option>
//                 <option value="Photo">Image (JPG, PNG)</option>
//               </select>
//             </div>

//             <div>
//               <label className="text-sm text-gray-300 block mb-1">Upload File *</label>
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 accept={formData.assignment_type === 'PDF' ? '.pdf' : 'image/*'}
//                 className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//                 required
//                 id="file-upload"
//               />
//               {file && (
//                 <div className="mt-2 p-2 bg-green-900/20 border border-green-700 rounded">
//                   <p className="text-green-300 font-medium">{file.name}</p>
//                   <p className="text-gray-400 text-sm">
//                     Size: {getFileSize(file.size)} • Type: {file.type}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading || !file}
//             className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 <span>Uploading to Cloudinary...</span>
//               </div>
//             ) : (
//               '📤 Upload Assignment'
//             )}
//           </button>
//         </form>
//       )}

//       {/* Search Section */}
//       {action === 'Search' && (
//         <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md space-y-4 mb-6">
//           <h3 className="text-xl font-bold text-blue-400">Search Assignments</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="text-sm text-gray-300 block mb-1">Teacher Name</label>
//               <input
//                 type="text"
//                 value={searchTeacher}
//                 onChange={(e) => setSearchTeacher(e.target.value)}
//                 placeholder="Filter by teacher"
//                 className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//               />
//             </div>
//             <div>
//               <label className="text-sm text-gray-300 block mb-1">Subject Name</label>
//               <input
//                 type="text"
//                 value={searchSubject}
//                 onChange={(e) => setSearchSubject(e.target.value)}
//                 placeholder="Filter by subject"
//                 className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//               />
//             </div>
//             <div>
//               <label className="text-sm text-gray-300 block mb-1">Semester</label>
//               <input
//                 type="text"
//                 value={searchSemester}
//                 onChange={(e) => setSearchSemester(e.target.value)}
//                 placeholder="Filter by semester"
//                 className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//               />
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={fetchQuestions}
//               disabled={loading}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
//             >
//               {loading ? 'Searching...' : 'Search'}
//             </button>
//             <button
//               onClick={clearSearch}
//               className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Delete Section */}
//       {action === 'Delete' && (
//         <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md space-y-6">
//           <div>
//             <h3 className="text-xl font-bold text-red-400 mb-4">Delete All by Teacher Name</h3>
//             <div className="flex gap-4 flex-col md:flex-row">
//               <input
//                 type="text"
//                 value={deleteTeacherName}
//                 onChange={(e) => setDeleteTeacherName(e.target.value)}
//                 placeholder="Enter teacher name"
//                 className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
//               />
//               <button
//                 onClick={handleDeleteAll}
//                 disabled={loading}
//                 className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
//               >
//                 {loading ? 'Deleting...' : 'Delete All'}
//               </button>
//             </div>
//             <p className="text-sm text-gray-400 mt-2">
//               ⚠️ This will delete ALL assignments uploaded by this teacher from both Cloudinary and database.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* View All/Search Results Section */}
//       {(action === 'View All' || action === 'Search') && (
//         <div className="space-y-6">
//           {loading ? (
//             <div className="flex justify-center items-center h-40">
//               <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
//             </div>
//           ) : questions.length === 0 ? (
//             <p className="text-gray-400 bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
//               No assignment questions found.
//             </p>
//           ) : (
//             <>
//               <div className="text-gray-300">
//                 Showing {questions.length} assignment(s)
//               </div>
//               {questions.map((q) => (
//                 <div
//                   key={q._id}
//                   className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md hover:bg-gray-750 transition"
//                 >
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h3 className="text-xl font-semibold text-blue-400 mb-2">{q.assignment_title}</h3>
//                       <p className="text-sm text-gray-400 mb-1">
//                         <b>Teacher:</b> {q.teacher_name} | <b>Subject:</b> {q.subject_name} |{' '}
//                         <b>Semester:</b> {q.semester}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         <b>Type:</b> {q.assignment_type} | <b>Size:</b> {getFileSize(q.file_size)} |{' '}
//                         <b>Uploaded:</b> {new Date(q.upload_time).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleDeleteOne(q._id)}
//                         className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>

//                   {/* Cloudinary File Link */}
//                   {q.cloudinary_url ? (
//                     <div className="mt-4 space-y-3">
//                       <div className="flex flex-wrap gap-3">
//                         <a
//                           href={q.cloudinary_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
//                         >
//                           👁️ View Assignment
//                         </a>
//                         <a
//                           href={q.cloudinary_url}
//                           download={`${q.assignment_title}_${q.subject_name}.${q.assignment_type.toLowerCase()}`}
//                           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
//                         >
//                           📥 Download
//                         </a>
//                       </div>
//                       <div className="p-3 bg-gray-900/50 rounded border border-gray-700">
//                         <p className="text-sm text-gray-400 break-all">
//                           <b>Cloudinary URL:</b>{' '}
//                           <a 
//                             href={q.cloudinary_url} 
//                             target="_blank" 
//                             rel="noopener noreferrer" 
//                             className="text-blue-300 hover:underline"
//                           >
//                             {q.cloudinary_url}
//                           </a>
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="mt-4 p-4 bg-red-900/40 border border-red-700 text-red-300 rounded-lg">
//                       ⚠️ File not found in Cloudinary
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


// components/teacher/AssignmentQuestions.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AssignmentQuestion {
  _id: string;
  assignment_title: string;
  teacher_name: string;
  subject_name: string;
  semester: string;
  assignment_type: string;
  cloudinary_url: string;
  cloudinary_public_id: string;
  file_name: string;
  file_size: number;
  upload_time: string;
}

interface UploadFormData {
  teacher_name: string;
  subject_name: string;
  semester: string;
  assignment_title: string;
  assignment_type: string;
}

interface UploadData extends UploadFormData {
  file_data: string;
  file_name: string;
  file_size: number;
}

export default function AssignmentQuestions() {
  const [action, setAction] = useState<'Upload' | 'Delete' | 'View All' | 'Search'>('Upload');
  const [formData, setFormData] = useState<UploadFormData>({
    teacher_name: '',
    subject_name: '',
    semester: '',
    assignment_title: '',
    assignment_type: 'PDF',
  });
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<AssignmentQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTeacherName, setDeleteTeacherName] = useState('');
  
  // Search filters
  const [searchTeacher, setSearchTeacher] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [searchSemester, setSearchSemester] = useState('');

  useEffect(() => {
    if (action === 'View All' || action === 'Search') {
      fetchQuestions();
    }
  }, [action]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get<AssignmentQuestion[]>('/api/assignment-questions');
      let filteredQuestions = response.data.reverse();
      
      // Apply search filters if in Search mode
      if (action === 'Search') {
        filteredQuestions = filteredQuestions.filter((q: AssignmentQuestion) => {
          let matches = true;
          if (searchTeacher) {
            matches = matches && q.teacher_name.toLowerCase().includes(searchTeacher.toLowerCase());
          }
          if (searchSubject) {
            matches = matches && q.subject_name.toLowerCase().includes(searchSubject.toLowerCase());
          }
          if (searchSemester) {
            matches = matches && q.semester.toLowerCase().includes(searchSemester.toLowerCase());
          }
          return matches;
        });
      }
      
      setQuestions(filteredQuestions);
    } catch {
      toast.error('Failed to fetch assignment questions');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }

    setLoading(true);
    
    try {
      // Convert file to base64
      console.log('Converting file to base64...', file.name, file.size);
      const file_data = await convertFileToBase64(file);
      console.log('Base64 conversion successful, length:', file_data.length);
      
      // Create upload data with explicit typing
      const uploadData: UploadData = {
        teacher_name: formData.teacher_name,
        subject_name: formData.subject_name,
        semester: formData.semester,
        assignment_title: formData.assignment_title,
        assignment_type: formData.assignment_type,
        file_data: file_data,
        file_name: file.name,
        file_size: file.size
      };

      console.log('Uploading to API...', {
        teacher: uploadData.teacher_name,
        subject: uploadData.subject_name,
        semester: uploadData.semester,
        title: uploadData.assignment_title,
        file: uploadData.file_name,
        size: uploadData.file_size,
        base64_length: uploadData.file_data.length
      });

      // Make the API call with explicit typing
      const response = await axios.post<{ 
        message: string; 
        cloudinary_url: string; 
        id: string;
        file_name: string;
      }>('/api/assignment-questions', uploadData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000, // 2 minute timeout for large files
      });
      
      console.log('Upload response:', response.data);
      toast.success('Assignment uploaded successfully! 🎉');
      
      // Reset form
      setFormData({
        teacher_name: '',
        subject_name: '',
        semester: '',
        assignment_title: '',
        assignment_type: 'PDF',
      });
      setFile(null);
      
      // Clear file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Refresh the list
      fetchQuestions();
      
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
        toast.error('Upload failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!deleteTeacherName) {
      toast.error('Enter teacher name');
      return;
    }
    
    if (!confirm(`Delete all assignments by ${deleteTeacherName}? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/api/assignment-questions?teacher_name=${encodeURIComponent(deleteTeacherName)}`);
      toast.success('All assignments deleted successfully');
      setDeleteTeacherName('');
      fetchQuestions();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOne = async (id: string) => {
    if (!confirm('Delete this assignment question? This action cannot be undone.')) return;
    
    setLoading(true);
    try {
      await axios.delete(`/api/assignment-questions?id=${id}`);
      toast.success('Assignment deleted successfully');
      fetchQuestions();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete assignment');
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

  const clearSearch = () => {
    setSearchTeacher('');
    setSearchSubject('');
    setSearchSemester('');
    fetchQuestions();
  };

  return (
    <div className="text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-300">Assignment Questions Management</h2>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {(['Upload', 'Search', 'View All', 'Delete'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setAction(option)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              action === option
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Upload Section */}
      {action === 'Upload' && (
        <form
          onSubmit={handleUpload}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'teacher_name', label: 'Teacher Name', placeholder: 'Enter teacher name' },
              { name: 'subject_name', label: 'Subject Name', placeholder: 'e.g., DBMS' },
              { name: 'semester', label: 'Semester', placeholder: 'e.g., Semester 4' },
              { name: 'assignment_title', label: 'Assignment Title', placeholder: 'e.g., Assignment 1' },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-sm text-gray-300 block mb-1">{field.label} *</label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name as keyof UploadFormData]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            ))}

            <div>
              <label className="text-sm text-gray-300 block mb-1">Assignment Type *</label>
              <select
                name="assignment_type"
                value={formData.assignment_type}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="PDF">PDF</option>
                <option value="Photo">Image (JPG, PNG)</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-1">Upload File *</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept={formData.assignment_type === 'PDF' ? '.pdf' : 'image/*'}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                required
                id="file-upload"
              />
              {file && (
                <div className="mt-2 p-2 bg-green-900/20 border border-green-700 rounded">
                  <p className="text-green-300 font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">
                    Size: {getFileSize(file.size)} • Type: {file.type}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading to Cloudinary...</span>
              </div>
            ) : (
              '📤 Upload Assignment'
            )}
          </button>
        </form>
      )}

      {/* Search Section */}
      {action === 'Search' && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md space-y-4 mb-6">
          <h3 className="text-xl font-bold text-blue-400">Search Assignments</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Teacher Name</label>
              <input
                type="text"
                value={searchTeacher}
                onChange={(e) => setSearchTeacher(e.target.value)}
                placeholder="Filter by teacher"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Subject Name</label>
              <input
                type="text"
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
                placeholder="Filter by subject"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Semester</label>
              <input
                type="text"
                value={searchSemester}
                onChange={(e) => setSearchSemester(e.target.value)}
                placeholder="Filter by semester"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchQuestions}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={clearSearch}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Delete Section */}
      {action === 'Delete' && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md space-y-6">
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-4">Delete All by Teacher Name</h3>
            <div className="flex gap-4 flex-col md:flex-row">
              <input
                type="text"
                value={deleteTeacherName}
                onChange={(e) => setDeleteTeacherName(e.target.value)}
                placeholder="Enter teacher name"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
              />
              <button
                onClick={handleDeleteAll}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              ⚠️ This will delete ALL assignments uploaded by this teacher from both Cloudinary and database.
            </p>
          </div>
        </div>
      )}

      {/* View All/Search Results Section */}
      {(action === 'View All' || action === 'Search') && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
            </div>
          ) : questions.length === 0 ? (
            <p className="text-gray-400 bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              No assignment questions found.
            </p>
          ) : (
            <>
              <div className="text-gray-300">
                Showing {questions.length} assignment(s)
              </div>
              {questions.map((q) => (
                <div
                  key={q._id}
                  className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md hover:bg-gray-750 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-400 mb-2">{q.assignment_title}</h3>
                      <p className="text-sm text-gray-400 mb-1">
                        <b>Teacher:</b> {q.teacher_name} | <b>Subject:</b> {q.subject_name} |{' '}
                        <b>Semester:</b> {q.semester}
                      </p>
                      <p className="text-sm text-gray-500">
                        <b>Type:</b> {q.assignment_type} | <b>Size:</b> {getFileSize(q.file_size)} |{' '}
                        <b>Uploaded:</b> {new Date(q.upload_time).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteOne(q._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Cloudinary File Link */}
                  {q.cloudinary_url ? (
                    <div className="mt-4 space-y-3">
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={q.cloudinary_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
                        >
                          👁️ View Assignment
                        </a>
                        <a
                          href={q.cloudinary_url}
                          download={`${q.assignment_title}_${q.subject_name}.${q.assignment_type.toLowerCase()}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
                        >
                          📥 Download
                        </a>
                      </div>
                      <div className="p-3 bg-gray-900/50 rounded border border-gray-700">
                        <p className="text-sm text-gray-400 break-all">
                          <b>Cloudinary URL:</b>{' '}
                          <a 
                            href={q.cloudinary_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-300 hover:underline"
                          >
                            {q.cloudinary_url}
                          </a>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-red-900/40 border border-red-700 text-red-300 rounded-lg">
                      ⚠️ File not found in Cloudinary
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}