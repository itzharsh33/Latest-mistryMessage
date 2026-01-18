import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// import {z} from "zod"
// import { usernamevalidation } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
  await dbConnect();
  try {
 const {username,code} = await request.json()
 const decodedUsername = decodeURIComponent(username)
 const user = await UserModel.findOne({username:decodedUsername})
 if(!user){
        return Response.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 }
    );
 }

const isCodeValid = user.verifyCode === code
const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

if(isCodeValid && isCodeNotExpired){
user.isVerified=true;
await user.save()
        return Response.json(
      {
        success: true,
        message: "Account verified successfully",
      },
      { status: 200 }
    );
}else if(!isCodeNotExpired){
        return Response.json(
      {
        success: false,
        message: "Verification code is expired. Please sign up again to get a new code",
      },
      { status: 400 }
    );
}else{  
            return Response.json(
      {
        success: false,
        message: "Incorrect verification code",
      },
      { status: 400 }
    );
}

  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}













// await dbConnect(): ensure MongoDB connection ready.

// await request.json(): parse incoming JSON body (the object you posted from the client).

// decodeURIComponent(username): decodes URL-encoded username (defensive).

// UserModel.findOne({ username }): fetch user doc from DB.

// Validation:

// isCodeValid: compares stored user.verifyCode with submitted code.

// isCodeNotExpired: checks expiry (verifyCodeExpiry) > new Date() (current time).

// Outcomes:

// valid & not expired → set isVerified = true, save user, return 200 with success message.

// expired → return 400 with message that code expired.

// invalid code → return 400 with "Incorrect verification code".

// catch returns 500 on unexpected errors.