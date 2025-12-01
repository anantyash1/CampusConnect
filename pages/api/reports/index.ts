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
    const db = await getDatabase();
    const studentsCollection = db.collection('students');
    const averageMarksCollection = db.collection('average_marks');
    const attendanceCollection = db.collection('attendance');

    const students = await studentsCollection.find({}).sort({ usn: 1 }).toArray();

    const subjects = ['dbms', 'daa', 'microcontroller', 'maths', 'uhv', 'biology'];
    
    const reportsData = await Promise.all(
      students.map(async (student) => {
        const usn = student.usn;
        const name = student.name;

        // Fetch average marks
        const averageMarks = await averageMarksCollection.findOne({ usn });
        const avgMarks: any = {};
        subjects.forEach((subject) => {
          avgMarks[subject] = averageMarks?.[subject] || 0;
        });

        // Fetch attendance
        const attendance = await attendanceCollection.findOne({ usn });
        const attendancePercentages: any = {};
        
        if (attendance && attendance.subjects) {
          subjects.forEach((subject) => {
            const subjectData = attendance.subjects[subject];
            if (subjectData && subjectData.total > 0) {
              attendancePercentages[subject] = 
                ((subjectData.attended / subjectData.total) * 100).toFixed(2);
            } else {
              attendancePercentages[subject] = 0;
            }
          });
        } else {
          subjects.forEach((subject) => {
            attendancePercentages[subject] = 0;
          });
        }

        return {
          usn,
          name,
          averageMarks: avgMarks,
          attendancePercentages,
        };
      })
    );

    res.status(200).json(reportsData);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}