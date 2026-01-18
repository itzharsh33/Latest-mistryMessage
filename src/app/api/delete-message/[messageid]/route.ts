// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/options";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import { User } from "next-auth";

// interface Params {
//   params: {
//     messageid: string;
//   };
// }


// export async function DELETE(request:Request,
//   {params}:{params:{messageid:string}}
//   // context: { params: { messageid: string } }
// ){
//   // const messageId = params.messageid
//   const messageId = params.messageid;
//   await dbConnect();
//   const session = await getServerSession(authOptions);
//   // const user: User = session?.user;
//     const user = session?.user as User & { _id: string };
//   // const user: User = session?.user as User
//   if (!session || !session.user) {
//     return Response.json(
//       {
//         success: false,
//         message: "Not Authenticated",
//       },
//       { status: 401 }
//     );
//   }


//   try {
//     const updateResult = await UserModel.updateOne(
//       {_id:user._id},
//       {$pull:{messages:{_id:messageId}}}
//     )

// if(updateResult.modifiedCount==0){
//       return Response.json(
//       {
//         success: false,
//         message: "Message not found or already deleted",
//       },
//       { status: 404 }
//     );

// }

//       return Response.json(
//       {
//         success: true,
//         message: "Message deleted",
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.log("Error in delete message route",error)
//           return Response.json(
//       {
//         success: false,
//         message: "Error deleting messages",
//       },
//       { status: 500 }
//     );
//   }



// }






import { getServerSession } from 'next-auth/next';
import { User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

// -> Import helpers and models:

// getServerSession → get the logged-in user session on the server.

// authOptions → your NextAuth config.

// dbConnect → connect to MongoDB.

// UserModel → your MongoDB User schema/model.

// User type → TypeScript type for a NextAuth user.

export async function DELETE(
  request: Request,
  // DEBUGGING: Using 'any' to bypass a potential type-checking issue.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  // You access messageid through context.params
  const messageId = context.params.messageid;

  // -> Define a DELETE API route handler.

// It expects params with a messageid (coming from the URL).

  // It's good practice to add a check here in case the structure is not what you expect
  if (!messageId) {
    return Response.json(
      { success: false, message: 'Message ID not found in request' },
      { status: 400 }
    );
  }

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  // -> Connect to MongoDB before running queries.

// Get the current logged-in session.

// Extract the user info from it.


  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    //->  Try to remove a message:

// Find the logged-in user (_id: user._id).

// Use MongoDB’s $pull operator → removes the message with this messageId from the messages array.

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: 'Message not found or already deleted',
        },
        { status: 404 }
      );
    }

    // -> If no message was deleted → return 404 Not Found.

    return Response.json(
      { success: true, message: 'Message deleted' },
      { status: 200 }
    );

    // -> If deletion worked → return success.

  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { success: false, message: 'Error deleting message' },
      { status: 500 }
    );
  }
}

// -> Catch any unexpected errors and return 500 Internal Server Error.










// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/options";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import { User } from "next-auth";


// -> Import helpers and models:

// getServerSession → get the logged-in user session on the server.

// authOptions → your NextAuth config.

// dbConnect → connect to MongoDB.

// UserModel → your MongoDB User schema/model.

// User type → TypeScript type for a NextAuth user.



// export async function DELETE(request:Request,{params}:{params:{messageid:string}}){

// -> Define a DELETE API route handler.

// It expects params with a messageid (coming from the URL).



//   const messageId = params.messageid
//->  Extract the messageid parameter.



//   await dbConnect();
//  const session = await getServerSession(authOptions);
//   const user: User = session?.user;

// -> Connect to MongoDB before running queries.

// Get the current logged-in session.

// Extract the user info from it.



//   if (!session || !session.user) {
//     return Response.json(
//       { success: false, message: "Not Authenticated" },
//       { status: 401 }
//     );
//   }

// -> If no session → return 401 Unauthorized (user not logged in).



//   try {
//     const updateResult = await UserModel.updateOne(
//       { _id: user._id },
//       { $pull: { messages: { _id: messageId } } }
//     )

//->  Try to remove a message:

// Find the logged-in user (_id: user._id).

// Use MongoDB’s $pull operator → removes the message with this messageId from the messages array.



// if(updateResult.modifiedCount==0){
//       return Response.json(
//         { success: false, message: "Message not found or already deleted" },
//         { status: 404 }
//       );
// }

// -> If no message was deleted → return 404 Not Found.


//       return Response.json(
//         { success: true, message: "Message deleted" },
//         { status: 200 }
//       );

// -> If deletion worked → return success.



//   } catch (error) {
//     console.log("Error in delete message route",error)
//     return Response.json(
//       { success: false, message: "Error deleting messages" },
//       { status: 500 }
//     );
//   }

// -> Catch any unexpected errors and return 500 Internal Server Error.



