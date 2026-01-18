import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
   _id: string;
  content: string;
  createdAt: Date;
}
// An interface in TypeScript is like a blueprint for objects.
// It tells the TypeScript compiler:
// “Any object of type Message must have these fields and these types.”

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface User extends Document {
    // _id: string;   
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified:boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password:{
    type:String,
    required:[true,"Password is required"]
  },
    verifyCode:{
    type:String,
    required:[true,"Verify code is required"]
  },
    verifyCodeExpiry:{
    type:Date,
    required:[true,"Verify code expiry is required"]
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  isAcceptingMessage:{
     type:Boolean,
    default:true
  },
  messages:[MessageSchema]

});

const UserModel=(mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema))

export default UserModel;


























// Explanation of this above file



// import mongoose, { Schema, Document } from "mongoose";

// ->Imports necessary components from the Mongoose library. Schema is used to define the structure of documents, and Document is a TypeScript type representing a Mongoose document.



// export interface Message extends Document {
// _id: string;
// content: string;
// createdAt: Date;
// }

// -> interface (TS): a way to name a structure (shape) of an object — which fields it has and what types those fields are. export makes it available to other files.

// Document is another Mongoose type that represents what all MongoDB documents automatically have (e.g., _id, .save(), .toObject(), etc.).

// By extending it, your Message interface gets both your custom fields (content, createdAt) and the built-in Mongoose document methods/properties.





// const MessageSchema: Schema<Message> = new Schema({
// content: {
// type: String,
// required: true,
// },
// createdAt: {
// type: Date,
// required: true,
// default: Date.now(),
// },
// });

// -> This Schema<Message> part is not the same thing as the imported Schema class.
// This is TypeScript’s way of telling the compiler:
// “This MessageSchema will be a Schema whose documents match the Message interface I defined.”
// On the right side (new Schema(...)), it’s used as a constructor to create a schema instance.




// export interface User extends Document {
//     // _id: string;   
//   username: string;
//   email: string;
//   password: string;
//   verifyCode: string;
//   verifyCodeExpiry: Date;
//   isVerified:boolean;
//   isAcceptingMessage: boolean;
//   messages: Message[];
// }

// ->This interface defines the TypeScript type for our User object, providing the same benefits of type safety and autocompletion as the Message interface. It includes an array of Message types, messages: Message[], which means a user document can contain a list of message documents.

// This is the main UserSchema for Mongoose. It defines all the fields for a user in the database, their data types (String, Date, Boolean), and validation rules (required, unique, etc.).

// trim: true (username): removes whitespace at ends when Mongoose casts the value — useful for user input trimming.

// unique: true: creates a unique index at MongoDB level (note: if the index does not exist yet in DB, you may get duplicates until the index is built). Also, unique: true on schema is not a validator — it's an instruction to create a DB index.

// match: validator that applies a regex to the value — here used to verify the email format. It's a simple regex and not full proof; for production you'd consider a more robust validation strategy.



// const UserModel=(mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema))

// ->This line is a bit tricky but is a standard Mongoose pattern in Next.js. In a serverless environment, code can be re-run for each request. This line checks if the User model has already been compiled (mongoose.models.User). If it has, it reuses the existing model. If not, it creates a new one (mongoose.model<User>("User", UserSchema)). This prevents errors from trying to redefine the same model multiple times. The as mongoose.Model<User> is a type assertion to tell TypeScript what type to expect.



// Because they serve different purposes:

// TypeScript interface
// Compile-time only.
// Prevents you from writing message.content = 123 in your code.
// Helps with IntelliSense/autocomplete in VS Code.

// Mongoose schema
// Runtime.
// Actually enforces rules on data being stored in MongoDB.
// Provides defaults, validation, casting, etc.








// this above file would look like this below without typescript

// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// // Message schema
// const MessageSchema = new Schema({
//   content: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
// });

// // User schema
// const UserSchema = new Schema({
//   username: {
//     type: String,
//     required: [true, "Username is required"],
//     trim: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     unique: true,
//     match: [/.+\@.+\..+/, "Please use a valid email address"],
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//   },
//   verifyCode: {
//     type: String,
//     required: [true, "Verify code is required"],
//   },
//   verifyCodeExpiry: {
//     type: Date,
//     required: [true, "Verify code expiry is required"],
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   isAcceptingMessage: {
//     type: Boolean,
//     default: true,
//   },
//   messages: [MessageSchema],
// });

// // User model
// const UserModel =
//   mongoose.models.User || mongoose.model("User", UserSchema);

// module.exports = UserModel;
