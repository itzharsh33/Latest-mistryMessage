





import { getServerSession } from 'next-auth/next';
import { User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';


export async function DELETE(
  request: Request,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
 
  const messageId = context.params.messageid;


  if (!messageId) {
    return Response.json(
      { success: false, message: 'Message ID not found in request' },
      { status: 400 }
    );
  }

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;




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


    if (updateResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: 'Message not found or already deleted',
        },
        { status: 404 }
      );
    }



    return Response.json(
      { success: true, message: 'Message deleted' },
      { status: 200 }
    );



  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { success: false, message: 'Error deleting message' },
      { status: 500 }
    );
  }
}











