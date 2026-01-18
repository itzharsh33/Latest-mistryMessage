import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request){
await dbConnect();
try {
    const {username,email,password} = await request.json()
    const existingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isVerified:true
    })
    if(existingUserVerifiedByUsername){
    return Response.json({
        success:false,
        message:"Username is already taken"
    },{status:400})
    }

    const existingUserByEmail = await UserModel.findOne({email})
    const verifyCode = Math.floor(1000000+Math.random()*9000000).toString()
    if(existingUserByEmail){
    if(existingUserByEmail.isVerified){
           return Response.json({
          success:false,
        message:"User already exist with this email"
        },{status:400})
    }else{
         const hasedPassword = await bcrypt.hash(password,10);
         existingUserByEmail.password = hasedPassword;
         existingUserByEmail.verifyCode=verifyCode;
         existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);
         await existingUserByEmail.save()
    }
    }else{
    const hasedPassword = await bcrypt.hash(password,10);
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours()+1)
       const newUser= new UserModel({
          username,
          email,
          password: hasedPassword,
          verifyCode,
          verifyCodeExpiry:expiryDate,
          isVerified:false,
          isAcceptingMessage:true,
          messages: []
    })
    await newUser.save()
    }
    // send varification email
   const emailResponse =  await sendVerificationEmail(
        email,
        username,
        verifyCode
    )
    if(!emailResponse.success){
        return Response.json({
          success:false,
        message:emailResponse.message
        },{status:500})
    }

       return Response.json({
          success:true,
        message:"User registered successfully. Please verify your email"
        },{status:201})

} catch (error) {
    console.error('Error registering user',error);
    return Response.json(
        {
       success:false,
       message:'Error registering user'
        },
        {
        status:500
        }
    )
}
}

















// Logic Flow:

// Establishes a DB connection.

// Parses the username, email, and password from the incoming JSON request body.

// Checks for existing username: Queries the database for a user with the same username who is already verified. If found, it returns an error.

// Checks for existing email:

// If a user with that email exists and is verified, it's an error.

// If a user exists but is not verified, it assumes they are trying to sign up again. It updates their password and verification code and re-sends the email.

// Creates new user: If no user with that email exists, it hashes the password using bcrypt (a one-way encryption function) and creates a new user document in the database with isVerified: false.

// Sends Email: It calls the sendVerificationEmail helper function.

// Returns a success or error Response.




// What is bcrypt?

// bcrypt is a popular library used for hashing passwords securely.

// Hashing means converting a plain password ("mypassword123") into an unreadable string ("$2b$10$...").

// It ensures that even if someone steals your database, they cannot directly see users’ real passwords.

// bcrypt also adds salt (random data) internally, so two users with the same password won’t have the same hash.

// 👉 Example:
// password123 → $2b$10$NYuR1h9iIMKFG3v3a8f8J.OChyPZ49g7Kgx5s7o1rxLZKc5c2S19K