import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import {User} from "next-auth"

// to flip accepting messages for currently logged in user
export async function POST(request: Request) {
    await dbConnect()

    const session =  await getServerSession(authOptions)
    // const user = session?.user
    const user : User = session?.user

    if(!session || !session.user){
        return Response.json(
            {
                success : false,
                message : "Not Authenticated"
            },
            {
                status : 401
            }
        )
    }

    const userId = user._id
    const {acceptMesssages} =  await request.json()

    try{
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage : acceptMesssages},
            {new : true}
        )

        if(!updatedUser){
            return Response.json(
                {
                    success : false,
                    message : "Failed to update user status for accepting messages"
                },
                {
                    status : 401
                }
            )
        }else{
            return Response.json(
                {
                    success : true,
                    message : "Updated user status for accepting messages" , 
                    updatedUser
                },
                {
                    status : 200
                }
            )
        }

    }catch(error){
        console.log("Failed to update user status for accepting messages")  
        return Response.json(
            {
                success : false,
                message : "Failed to update user status for accepting messages"
            },
            {
                status : 500
            }
        )
    }
}

// User exists or not, if exists, then accpeting message or not
export async function GET(request : Request){
    await dbConnect()
    const session =  await getServerSession(authOptions)
    // const user = session?.user
    const user : User = session?.user
    if(!session || !session.user){
        return Response.json(
            {
                success : false,
                message : "Not Authenticated"
            },
            {
                status : 401
            }
        )
    }

    const userId = user._id
    try {
        const foundUser =  await UserModel.findById(userId)
        if(!foundUser){
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },
                {
                    status : 404
                }
            )
        }
    
        return Response.json(
            {
                success : true,
                isAcceptingMessage : foundUser.isAcceptingMessage
            },
            {
                status : 200
            }
        )
    } catch (error) {
        console.log("Error in getting message accpetane status")  
        return Response.json(
            {
                success : false,
                message : "Error in getting message accpetane status"
            },
            {
                status : 500
            }
        )

    }
}