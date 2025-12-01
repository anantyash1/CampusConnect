import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await getDatabase();
    const studentsCollection = db.collection('students');
    const assignmentsCollection = db.collection('assignment');
    const averageMarksCollection = db.collection('average_marks');

    const students = await studentsCollection.find({}).toArray();
    const subjects = ['dbms', 'daa', 'microcontroller', 'maths', 'uhv', 'biology'];
    const assignments = ['Assignment 1', 'Assignment 2', 'Assignment 3'];

    for (const student of students) {
      const usn = student.usn;
      const averages: any = {};

      for (const subject of subjects) {
        const marks: number[] = [];
        
        for (const assignment of assignments) {
          const assignmentData = await assignmentsCollection.findOne({
            usn,
            assignment,
          });
          
          if (assignmentData && assignmentData[subject] !== undefined) {
            marks.push(assignmentData[subject]);
          }
        }

        // Calculate average of best two assignments
        if (marks.length > 0) {
          marks.sort((a, b) => b - a);
          const bestTwo = marks.slice(0, 2);
          averages[subject] = bestTwo.reduce((sum, mark) => sum + mark, 0) / bestTwo.length;
        } else {
          averages[subject] = 0;
        }
      }

      await averageMarksCollection.updateOne(
        { usn },
        { $set: averages },
        { upsert: true }
      );
    }

    res.status(200).json({ message: 'Average marks calculated successfully' });
  } catch (error) {
    console.error('Calculate average error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}