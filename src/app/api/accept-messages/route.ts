import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { isAcceptingMessageSchema } from "@/schemas/acceptMessageSchema";

export async function POST(request: Request) {
  await dbConnect();
//   Exported POST function (handles POST requests).
// First step: ensure DB connection.
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  // Get server-side session; extract user from it (typed as User). session?.user can be undefined if no session.

  // const user: User = session?.user as User
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  // If not logged in → return 401 JSON response { success:false, message:... }.

  const userId = user._id;
//   const body = await request.json();
// const acceptMessages = body.acceptMessages;
  const { acceptMessages } = await request.json();
// above commented also do same

// userId = currently logged-in user id (from session token).
// Parse JSON body from request and destructure acceptMessages (expected boolean).

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    // Attempt to update the user document by id, setting isAcceptingMessage to the provided value. { new: true } returns the updated document.
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        { status: 401 }
      );
    }
    // If update returned null (user not found) → return 401 (you might prefer 404 here; file uses 401).

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}
// On success → return 200 with updated user object.
// On unexpected error → log and return 500.

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  // Exported GET handler. Same startup: ensure DB connection, fetch session and user.

  // const user: User = session?.user as User
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  // If not authenticated → return 401.

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    // Read the user document by id.

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    // If user not found → return 404.

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}

// On success → return 200 with isAcceptingMessages boolean.
// On error → log and return 500.




// import { getServerSession } from "next-auth";
// -> Server-side helper to read the current NextAuth session (works inside API/Route handlers).
// import { authOptions } from "../auth/[...nextauth]/options";
// -> Your NextAuth configuration — passed into getServerSession so it can validate the session.
// import dbConnect from "@/lib/dbConnect";
// -> Utility that ensures a Mongoose/MongoDB connection exists before DB operations.
// import UserModel from "@/model/User";
// -> Your Mongoose model for users — used to query/update user documents.
// import { User } from "next-auth";
// -> TypeScript User type from NextAuth (used for type annotations).
// import { isAcceptingMessageSchema } from "@/schemas/acceptMessageSchema";
// -> A Zod schema imported (intended to validate request body). Note: it is imported but not used in the file.







// The reason one is POST and the other is GET is because of the purpose of the request:

// 🔹 POST — to update/change data

// POST requests are used when you want to create or modify something in the database.

// In your case, the client sends a JSON body:

// { "acceptMessages": true }


// This means: "I want to update my profile to accept messages."

// So the backend must write to the database (findByIdAndUpdate), hence POST is the right choice.

// 🔹 GET — to read/fetch data

// GET requests are used when you just want to retrieve data without modifying anything.

// Here, you only want to check whether the user is currently accepting messages or not:

// { "success": true, "isAcceptingMessages": true }


// This only reads from the database (findById), so GET is correct.

// ✅ In short

// POST → when client sends new data and expects DB update.

// GET → when client only requests existing data.




