import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase();
  const assignmentsCollection = db.collection('assignment');

  if (req.method === 'GET') {
    try {
      const { usn } = req.query;
      
      if (usn) {
        // Case-insensitive search using regex
        const upperUSN = (usn as string).toUpperCase().trim();
        
        // Use regex for case-insensitive matching
        const assignments = await assignmentsCollection
          .find({ 
            usn: { 
              $regex: new RegExp(`^${upperUSN}$`, 'i') 
            } 
          })
          .toArray();
        
        console.log('Query USN:', upperUSN); // Debug log
        console.log('Found assignments:', assignments.length); // Debug log
        
        return res.status(200).json(assignments);
      }

      // If no USN provided, return all assignments
      const allAssignments = await assignmentsCollection.find({}).toArray();
      res.status(200).json(allAssignments);
    } catch (error) {
      console.error('Get assignments error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const assignmentData = req.body;
      
      // Ensure USN is uppercase
      assignmentData.usn = assignmentData.usn.toUpperCase().trim();
      
      await assignmentsCollection.updateOne(
        { 
          usn: assignmentData.usn, 
          assignment: assignmentData.assignment 
        },
        { $set: assignmentData },
        { upsert: true }
      );
      res.status(201).json({ message: 'Assignment saved successfully' });
    } catch (error) {
      console.error('Save assignment error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { usn, assignment } = req.query;
      const upperUSN = (usn as string).toUpperCase().trim();
      
      await assignmentsCollection.deleteOne({ 
        usn: { $regex: new RegExp(`^${upperUSN}$`, 'i') }, 
        assignment 
      });
      res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
      console.error('Delete assignment error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}