import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';
import { Student } from '@/types';  // Ensure this import matches your Student interface

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Student | { message: string }>
) {
  const { usn } = req.query;

  if (typeof usn !== 'string') {
    return res.status(400).json({ message: 'Invalid USN' });
  }

  const db = await getDatabase();
  const studentsCollection = db.collection('students');

  if (req.method === 'GET') {
    try {
      const student = await studentsCollection.findOne<Student>(
        { usn: usn.toUpperCase() },
        { projection: { _id: 0 } }  // Exclude _id if not in Student type
      );
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      return res.status(200).json(student);  // No 'as Student' needed with generic
    } catch (error) {
      console.error('Get student error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}