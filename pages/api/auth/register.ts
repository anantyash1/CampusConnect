import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password, role } = req.body;

    if (!username || username.length < 5) {
      return res.status(400).json({
        message: 'Username must be at least 5 characters long',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    if (!['teacher', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    // Check if username already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await hashPassword(password);

    await usersCollection.insertOne({
      username,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}