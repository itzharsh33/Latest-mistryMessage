
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

// getServerSession → to get the current logged-in user session (server-side).
// authOptions → your NextAuth config file.
// dbConnect → function to connect to MongoDB.
// UserModel → Mongoose model for your users collection.
// User → type from NextAuth (for TypeScript safety).
// mongoose → to use ObjectId.

export async function GET(request: Request) {
  // Declares a GET API route handler (this runs when client calls this API with a GET request).
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;
//   Retrieves the logged-in session.
// Extracts user object from the session (if available).

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  // If no session exists → user is not logged in → return 401 Unauthorized response.

  // Ensure user._id is a string before creating ObjectId
  const userId = new mongoose.Types.ObjectId(user._id);
  // Converts the user’s _id (string from session) into a MongoDB ObjectId so it can be used in aggregation queries.

  try {
    const userMessages = await UserModel.aggregate([
      // Corrected the $match stage to use _id
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } }
    ]);

// Runs a MongoDB aggregation pipeline:
// $match → find the user by _id.
// $unwind → deconstructs the messages array (treats each message as a separate row).
// $sort → sorts messages by createdAt in descending order (latest first).
// $group → groups them back into one user, but with messages collected into an array again.

    if (!userMessages || userMessages.length === 0) {
      return Response.json(
        {
          success: true,
          messages: [], // Return empty array if no messages
        },
        { status: 200 }
      );
    }
    // If no messages are found, return an empty array instead of throwing an error.

    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages
      },
      { status: 200 }
    );
    // If messages exist → return them in the response with 200 OK.

  } catch (error) {
    console.log("An unexpected error occurred:", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
  // If anything goes wrong (DB error, aggregation error, etc.), return 500 Internal Server Error.
}











// ✅ Summary

// This API:

// Connects to DB.

// Checks if user is logged in.

// Finds the user’s messages using MongoDB aggregation.

// Sorts messages by newest first.

// Returns them (or an empty list if none).





