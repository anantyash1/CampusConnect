require('dotenv').config();   // Load .env
const { MongoClient } = require('mongodb');
const { hashSync } = require('bcryptjs');

const uri = process.env.MONGODB_URI;   // Use Atlas URI

async function setupDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db('anantnew');  // your real DB name

    const sampleUsers = [
      {
        username: 'testteacher',
        password: hashSync('password123', 10),
        role: 'teacher',
        email: 'teacher@example.com',
        createdAt: new Date()
      },
      {
        username: 'teststudent',
        password: hashSync('password123', 10),
        role: 'student',
        email: 'student@example.com',
        createdAt: new Date()
      }
    ];

    await db.collection('users').deleteMany({});
    const result = await db.collection('users').insertMany(sampleUsers);

    console.log(`✅ Created ${result.insertedCount} sample users`);
    console.log('\n📋 Login Credentials:');
    console.log('Teacher - Username: testteacher, Password: password123');
    console.log('Student - Username: teststudent, Password: password123');
    console.log('\n🎯 Setup complete!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await client.close();
  }
}

setupDatabase();
