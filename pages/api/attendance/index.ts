import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase();
  const attendanceCollection = db.collection('attendance');

  if (req.method === 'GET') {
    try {
      const { usn } = req.query;
      const query = usn ? { usn } : {};
      const attendance = await attendanceCollection.find(query).toArray();
      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const attendanceData = req.body;
      await attendanceCollection.updateOne(
        { usn: attendanceData.usn, semester: attendanceData.semester },
        { $set: attendanceData },
        { upsert: true }
      );
      res.status(201).json({ message: 'Attendance saved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { usn } = req.query;
      await attendanceCollection.deleteMany({ usn });
      res.status(200).json({ message: 'Attendance deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}