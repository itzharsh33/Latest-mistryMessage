import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request){
// Defines a POST API endpoint (runs when client sends a POST request).
await dbConnect()

const {username,content} = await request.json()
// the content parameter is used below
// Reads data from request body (JSON).
// Extracts username (who will receive message) and content (the actual message text).

try {
const user = await UserModel.findOne({username})
// Searches database for a user with the given username.
if(!user){
    return Response.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 }
    );
}
// If no user exists → return error 404 User not found.

// is User accepting messages

if(!user.isAcceptingMessage){
    return Response.json(
      {
        success: false,
        message: "User is not accepting the messages",
      },
      { status: 403 }
    );
}
// If user has disabled message acceptance → return error 403 Forbidden.

const newMessage = {content, createdAt:new Date()}
// Creates a new message object with:
// content (text from request).
// createdAt (current timestamp).
// it has two fields as it is predefined in MessageSchema
user.messages.push(newMessage as Message)
await user.save()
// Pushes the new message into the user’s messages array.
// Saves the updated user back to the database.

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );

// If everything goes well → return success message with 200 OK.

} catch (error) {
    console.log("Error in sending messages:",error)
        return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
}
// If something unexpected happens → log error and return 500 Internal Server Error.

}


















// Summary

// This API endpoint:

// Connects to MongoDB.

// Reads username and message content from request.

// Finds the target user.

// Checks if they accept messages.

// If yes → saves the message in their account.

// Returns success or error depending on the outcome.