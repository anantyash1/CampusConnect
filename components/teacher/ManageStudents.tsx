// /components/teacher/managestudent.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Student } from '@/types';
import Image from 'next/image';

export default function ManageStudents() {
  const [action, setAction] = useState<'Add' | 'Delete' | 'View All'>('Add');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    usn: '',
    name: '',
    gender: 'Male',
    address: '',
    mobile: '',
    branch: '',
    current_sem: 1,
    academic_year: '',
    '12_percentage': 0,
    '10_percentage': 0,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  useEffect(() => {
    if (action === 'View All' || action === 'Delete') {
      fetchStudents();
    }
  }, [action]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes('percentage') || name === 'current_sem'
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let photo_data = null;
      if (photoFile) {
        photo_data = await convertFileToBase64(photoFile);
      }

      const studentData = {
        ...formData,
        photo_data
      };

      await axios.post('/api/students', studentData, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('Student added successfully');
      
      // Reset form
      setFormData({
        usn: '',
        name: '',
        gender: 'Male',
        address: '',
        mobile: '',
        branch: '',
        current_sem: 1,
        academic_year: '',
        '12_percentage': 0,
        '10_percentage': 0,
      });
      setPhotoFile(null);
      setPhotoPreview('');
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (usn: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/students?usn=${usn}`);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch {
      toast.error('Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6">Manage Students</h2>

      {/* Action Buttons */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {(['Add', 'Delete', 'View All'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setAction(option)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                action === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Add Student Form */}
      {action === 'Add' && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'USN', name: 'usn', type: 'text' },
              { label: 'Name', name: 'name', type: 'text' },
              { label: 'Branch', name: 'branch', type: 'text' },
              { label: 'Mobile', name: 'mobile', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm mb-1 text-gray-300">
                  {label} *
                </label>
                <input
                  type={type}
                  name={name}
                  value={(formData as any)[name]}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-sm mb-1 text-gray-300">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                required
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Current Semester *
              </label>
              <input
                type="number"
                name="current_sem"
                value={formData.current_sem}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                min={1}
                max={8}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Academic Year *
              </label>
              <input
                type="text"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleInputChange}
                placeholder="2023-2024"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                required
              />
            </div>

            {['12_percentage', '10_percentage'].map((key) => (
              <div key={key}>
                <label className="block text-sm mb-1 text-gray-300">
                  {key === '12_percentage' ? '12th % *' : '10th % *'}
                </label>
                <input
                  type="number"
                  name={key}
                  value={(formData as any)[key]}
                  onChange={handleInputChange}
                  step="0.01"
                  min={0}
                  max={100}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                  required
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-sm mb-1 text-gray-300">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1 text-gray-300">Photo *</label>
              <input
                type="file"
                onChange={handlePhotoChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                accept="image/*"
                required
              />
              {photoPreview && (
                <div className="mt-2">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Photo Preview</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Adding Student...' : 'Add Student'}
          </button>
        </form>
      )}

      {/* Delete Students */}
      {action === 'Delete' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : students.length === 0 ? (
            <p className="text-gray-400">No students found.</p>
          ) : (
            students.map((student) => (
              <div
                key={student.usn}
                className="flex justify-between items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                <div>
                  <p className="font-medium text-white">{student.name}</p>
                  <p className="text-sm text-gray-400">USN: {student.usn}</p>
                </div>
                <button
                  onClick={() => handleDelete(student.usn)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* View All */}
      {action === 'View All' && (
        <div>
          {loading ? (
            <div className="text-center py-8 text-gray-300">Loading...</div>
          ) : students.length === 0 ? (
            <p className="text-gray-400">No students found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div
                  key={student.usn}
                  className="bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700"
                >
                  {/* Check both photo_url and old photo field for backward compatibility */}
                  {(student.photo_url || student.photo) ? (
                    <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image
                        src={student.photo_url || `/uploaded_photos/${student.usn}.jpg`}
                        alt={student.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          // Create a fallback div
                          const parent = target.parentElement;
                          if (parent) {
                            const fallbackDiv = document.createElement('div');
                            fallbackDiv.className = 'w-full h-full flex items-center justify-center bg-gray-700 rounded-full';
                            fallbackDiv.innerHTML = `
                              <div class="text-gray-400 text-sm text-center">
                                <div class="text-2xl">👤</div>
                                <div>No Photo</div>
                              </div>
                            `;
                            parent.appendChild(fallbackDiv);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <div className="text-2xl">👤</div>
                        <div className="text-sm">No Photo</div>
                      </div>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-center mb-2">
                    {student.name}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><strong>USN:</strong> {student.usn}</p>
                    <p><strong>Gender:</strong> {student.gender}</p>
                    <p><strong>Branch:</strong> {student.branch}</p>
                    <p><strong>Semester:</strong> {student.current_sem}</p>
                    <p><strong>Mobile:</strong> {student.mobile}</p>
                    <p><strong>12th %:</strong> {student['12_percentage']}%</p>
                    <p><strong>10th %:</strong> {student['10_percentage']}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}