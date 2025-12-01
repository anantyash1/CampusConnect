// pages/api/auth/login.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "@/lib/mongodb";
import { verifyPassword } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const db = await getDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Remove password from user object
    const { password: _pw, ...safeUser } = user;

    return res.status(200).json({
      message: "Login successful",
      user: {
        ...safeUser,
        id: user._id.toString(), // convert ObjectId to string
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
