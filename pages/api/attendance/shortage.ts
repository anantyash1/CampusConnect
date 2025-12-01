import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { semester, subject } = req.query;

    if (!semester || !subject) {
      return res.status(400).json({ message: 'Semester and subject are required' });
    }

    const db = await getDatabase();
    const studentsCollection = db.collection('students');
    const attendanceCollection = db.collection('attendance');

    const students = await studentsCollection.find({}).toArray();
    const shortageList = [];

    for (const student of students) {
      const usn = student.usn;
      const name = student.name;

      const attendanceRecord = await attendanceCollection.findOne({
        usn,
        semester: semester as string,
      });

      if (attendanceRecord && attendanceRecord.subjects) {
        const subjectData = attendanceRecord.subjects[subject as string];
        
        if (subjectData) {
          const attended = subjectData.attended || 0;
          const total = subjectData.total || 0;
          
          if (total > 0) {
            const percentage = (attended / total) * 100;
            
            if (percentage < 85) {
              shortageList.push({
                usn,
                name,
                attended,
                total,
                percentage: percentage.toFixed(2),
              });
            }
          }
        }
      }
    }

    res.status(200).json(shortageList);
  } catch (error) {
    console.error('Get attendance shortage error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}