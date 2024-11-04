import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";
import {User} from "next-auth"
import mongoose from "mongoose";
import { use } from "react";

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
    // const userId = user._id
    // We store USER ID as string , converted during options.ts file, but while performing Aggregation Pipelines, id as string causes a lot of issues, so we need to convert it back to number before proceeding further
    const userId = new mongoose.Types.ObjectId(user._id) ;
    try{
        const user = await UserModel.aggregate(
            [
                {
                    $match : {id : userId}
                },
                {
                    $unwind : '$messages'
                },
                {
                    $sort : {'messages.createdAt' : -1}
                },
                {
                    $group : {_id : '$_id' , messages : {$push : '$messages'}}
                }
            ]
        ) 
        if(!user || user.length === 0){
            return Response.json(
                {
                    success  :false,
                    messages : "User not found"
                },
                {
                    status  :401 
                }
            )
        }else{
            return Response.json(
                {
                    success  :true,
                    messages : user[0].messages
                },
                {
                    status : 200
                }
            )
        }
    }catch(error){
        console.log("Unexpected Error" , error)
        return Response.json(
            {
                success : false , 
                message : "Unexpected Error"
            },
            {
                status : 500
            }
        )
    }

}