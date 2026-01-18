import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number
}

const connection : ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
    console.log("already connected to database");
    return;
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI||'',{})
        connection.isConnected = db.connections[0].readyState
        console.log("Database connected successfully")
    } catch(error){
    console.log("Database connection failed",error);
    process.exit(1)
    }
}

export default dbConnect;









// One-line summary: A utility function to establish and manage a reusable connection to the MongoDB database.

// Dependencies: Imports mongoose. It's used by every API route that needs to talk to the database.


// TypeScript Emphasis type Alias

// What it is: The type keyword creates a custom type alias. It's similar to interface but can be more flexible for creating unions, intersections, or aliasing primitive types. Here, it defines ConnectionObject as an object that can optionally have an isConnected property of type number.




// 1. mongoose.connect(...)

// This establishes a connection to your MongoDB server.

// It returns a Mongoose connection object (often called Mongoose itself, but it has useful properties).

// 2. db.connections[0]

// db.connections is an array of connections that Mongoose is handling.

// Since in most apps you’re only connecting to one database, it will be at index 0.

// 3. .readyState

// readyState is a number representing the status of the connection:

// 0 → disconnected

// 1 → connected

// 2 → connecting

// 3 → disconnecting

// So db.connections[0].readyState tells you what state the connection is in right now.

// 4. connection.isConnected = db.connections[0].readyState

// Here, you are saving the connection state into your own variable connection.isConnected.

// This way, you don’t have to keep checking Mongoose internals — you can simply use connection.isConnected anywhere in your code to quickly know whether you’re connected to MongoDB.