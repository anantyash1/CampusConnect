import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase();
  const resultsCollection = db.collection('results');

  if (req.method === 'GET') {
    try {
      const { usn, semester } = req.query;
      
      if (usn && semester) {
        const result = await resultsCollection.findOne({ 
          usn: usn as string, 
          semester: semester as string 
        });
        return res.status(200).json(result);
      }

      const results = await resultsCollection.find({}).toArray();
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const resultData = req.body;
      await resultsCollection.updateOne(
        { usn: resultData.usn, semester: resultData.semester },
        { $set: resultData },
        { upsert: true }
      );
      res.status(201).json({ message: 'Result saved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { usn } = req.query;
      await resultsCollection.deleteMany({ usn });
      res.status(200).json({ message: 'Results deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}