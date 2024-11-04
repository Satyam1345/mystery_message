import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request : Request){
    await dbConnect()

    const {username , content} = await request.json()
    try{
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    success : false , 
                    message : "User not found"
                },
                {
                    status : 404
                }
            )
        }

        // Is User accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success : false , 
                    message : "User is not accpeting messages"
                },
                {
                    status : 403
                }
            )
        }

        const newMessage = {content , createdAt : new Date()}
        user.messages.push(newMessage as Message) 
        await user.save()

        return Response.json(
            {
                success : true , 
                message : "Messages sent Successfully"
            },
            {
                status : 200
            }
        )
    }catch(error){
        console.log("Sending Messages Error" , error)
        return Response.json(
            {
                success : false , 
                message : "Unexpected Error while sending Messages"
            },
            {
                status : 500
            }
        )
    }
}

