import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, role, username } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role required" });
    }

    const db = await getDatabase();
    
    // Update user role
    const result = await db.collection("users").updateOne(
      { email },
      { 
        $set: { 
          role, 
          username: username || email.split('@')[0],
          updatedAt: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      // If no user found with email, create one (for Google users)
      await db.collection("users").insertOne({
        email,
        username: username || email.split('@')[0],
        role,
        provider: "google",
        createdAt: new Date()
      });
    }

    return res.status(200).json({ message: "Role updated successfully" });
  } catch (err) {
    console.error("Update role error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}