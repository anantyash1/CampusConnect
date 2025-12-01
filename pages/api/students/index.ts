// /pages/api/students/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await getDatabase();
  const studentsCollection = db.collection("students");

  // ---------------- GET: Fetch all students ----------------
  if (req.method === "GET") {
    try {
      const students = await studentsCollection.find({}).toArray();

      // Transform to ensure consistent data structure
      const transformedStudents = students.map((student) => ({
        _id: student._id,
        usn: student.usn,
        name: student.name,
        gender: student.gender || "Male",
        address: student.address,
        mobile: student.mobile,
        branch: student.branch,
        current_sem: student.current_sem || 1,
        academic_year: student.academic_year || "2023-2024",
        "12_percentage": student["12_percentage"] || 0,
        "10_percentage": student["10_percentage"] || 0,
        // Cloudinary photo URL (new system)
        photo_url: student.photo_url || null,
        cloudinary_public_id: student.cloudinary_public_id || null,
        // Backward compatibility: photo field (old system)
        photo: student.photo_url ? true : student.photo || false,
        createdAt: student.createdAt || new Date(),
      }));

      res.status(200).json(transformedStudents);
    } catch (error) {
      console.error("Get students error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error";

      res.status(500).json({
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }
  }

  // ---------------- POST: Add a new student ----------------
  else if (req.method === "POST") {
    try {
      const {
        usn,
        name,
        gender,
        address,
        mobile,
        branch,
        current_sem,
        academic_year,
        "12_percentage": twelfth_percentage,
        "10_percentage": tenth_percentage,
        photo_data, // Base64 photo
      } = req.body;

      console.log("Received student data:", {
        usn,
        name,
        hasPhoto: !!photo_data,
        photoDataLength: photo_data?.length,
      });

      // Validation
      if (!usn || usn.length !== 10) {
        return res.status(400).json({
          message: "Invalid USN (must be 10 characters)",
        });
      }

      if (!name || !mobile || !branch || !address) {
        return res.status(400).json({
          message: "Required fields missing: name, mobile, branch, address",
        });
      }

      // Check duplicate USN
      const existingStudent = await studentsCollection.findOne({
        usn: usn.toUpperCase().trim(),
      });
      if (existingStudent) {
        return res.status(400).json({
          message: "USN already exists",
        });
      }

      let photoUrl = null;
      let cloudinaryPublicId = null;

      // Handle photo upload to Cloudinary
      if (
        photo_data &&
        typeof photo_data === "string" &&
        photo_data.startsWith("data:")
      ) {
        try {
          console.log("Processing photo upload to Cloudinary...");
          const base64Data = photo_data.split(",")[1];
          if (base64Data) {
            const photoBuffer = Buffer.from(base64Data, "base64");

            // Validate file size (max 2MB for profile photos)
            if (photoBuffer.length > 2 * 1024 * 1024) {
              return res.status(413).json({
                message: "Photo size too large. Maximum 2MB allowed.",
              });
            }

            const uploadResult = await uploadToCloudinary(
              photoBuffer,
              "student-photos",
              "image"
            );

            photoUrl = uploadResult.secure_url;
            cloudinaryPublicId = uploadResult.public_id;
            console.log("Photo uploaded to Cloudinary:", {
              photoUrl,
              cloudinaryPublicId,
            });
          }
        } catch (uploadError: any) {
          console.error("Cloudinary upload error:", uploadError);
          // Continue without photo if upload fails
          console.warn("Photo upload failed, creating student without photo");
        }
      } else if (photo_data) {
        console.warn("Invalid photo_data format received");
      }

      // Create student record
      const studentData = {
        usn: usn.toUpperCase().trim(),
        name: name.trim(),
        gender: (gender || "Male").trim(),
        address: address.trim(),
        mobile: mobile.trim(),
        branch: branch.toUpperCase().trim(),
        current_sem: parseInt(current_sem) || 1,
        academic_year: academic_year?.trim() || "2023-2024",
        "12_percentage": parseFloat(twelfth_percentage) || 0,
        "10_percentage": parseFloat(tenth_percentage) || 0,
        photo_url: photoUrl,
        cloudinary_public_id: cloudinaryPublicId,
        // Keep old photo field for backward compatibility
        photo: !!photoUrl,
        createdAt: new Date(),
      };

      console.log("Inserting student data:", {
        usn: studentData.usn,
        hasPhoto: !!photoUrl,
      });

      const result = await studentsCollection.insertOne(studentData);

      console.log("Student added successfully:", result.insertedId);

      res.status(201).json({
        message: "Student added successfully",
        id: result.insertedId,
        photo_url: photoUrl,
        usn: studentData.usn,
      });
    } catch (error: any) {
      console.error("Add student error:", error);

      // Handle specific errors
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).json({
          message: "USN already exists",
        });
      }

      res.status(500).json({
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // ---------------- DELETE: Delete a student by USN ----------------
  else if (req.method === "DELETE") {
    try {
      const { usn } = req.query;

      if (!usn || typeof usn !== "string") {
        return res.status(400).json({
          message: "USN is required",
        });
      }

      // Get student first to check for Cloudinary cleanup
      const student = await studentsCollection.findOne({
        usn: usn.toUpperCase().trim(),
      });

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      // Delete from DB
      const result = await studentsCollection.deleteOne({
        usn: usn.toUpperCase().trim(),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      console.log(`Student ${usn} deleted successfully`);

      // Note: We could delete from Cloudinary here if needed
      // but leaving photo cleanup to Cloudinary's auto-cleanup
      // For production, you might want to implement cleanup:
      // if (student.cloudinary_public_id) {
      //   await deleteFromCloudinary(student.cloudinary_public_id);
      // }

      res.status(200).json({
        message: "Student deleted successfully",
      });
    } catch (error) {
      console.error("Delete student error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error";

      res.status(500).json({
        message: "Failed to delete student",
        error:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }
  }

  // ---------------- PATCH: Update student (optional) ----------------
  else if (req.method === "PATCH") {
    try {
      const { usn, ...updateData } = req.body;

      if (!usn) {
        return res.status(400).json({
          message: "USN is required",
        });
      }

      // Remove any undefined fields
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      const result = await studentsCollection.updateOne(
        { usn: usn.toUpperCase().trim() },
        { $set: { ...cleanUpdateData, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      res.status(200).json({
        message: "Student updated successfully",
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Update student error:", error);

      const errMessage =
        error instanceof Error ? error.message : "Unexpected error";

      res.status(500).json({
        message: "Failed to update student",
        error: process.env.NODE_ENV === "development" ? errMessage : undefined,
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE", "PATCH"]);
    res.status(405).json({
      message: `Method ${req.method} not allowed`,
    });
  }
}
