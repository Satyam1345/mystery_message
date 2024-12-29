import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { User } from "next-auth";

export async function DELETE(req: Request) {
  await dbConnect();

  // Extract messageid from the URL
  const url = new URL(req.url);
  const messageid = url.pathname.split('/').pop(); // Get the last part of the path as messageid

  if (!messageid) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Message ID is required",
      }),
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not Authenticated",
      }),
      { status: 401 }
    );
  }

  try {
    // Perform the deletion of the message from the user's data
    const updateResult = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { messages: { _id: messageid } },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Message not found or already deleted",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message Deleted",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in delete message route", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error deleting message",
      }),
      { status: 500 }
    );
  }
}
