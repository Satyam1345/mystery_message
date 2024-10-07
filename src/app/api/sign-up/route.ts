import dbConnect from "@/lib/dbConnect";
import  {UserModel}  from "@/models/User";
import bcrypt from "bcryptjs" ;

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect()

    try{
        const {username , email , password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified : true 
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success : false ,
                message : "Username already exists"
            } , 
        {
            status : 400 
        })
        }

        const existingUserByEmail = await UserModel.findOne({
            email,
            isVerified : true
        })

        const verifyCode = Math.floor(100000+Math.random() *900000).toString() 

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success : false ,
                    message :  "User alreasy exists with this email id"
                } , {status : 400})
            }else{
                const hashedPassword = await bcrypt.hash(password , 10)
                existingUserByEmail.password = hashedPassword ;
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000) // this is 1 hour(written in seconds)
                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date() 
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password : hashedPassword,
                verifyCode ,
                isVerified : false ,
                verifyCodeExpiry : expiryDate ,
                isAcceptingMessage : true ,
                messages : []
            })

            await newUser.save() ;

            //Send Verification Email
            const emailResponse = await sendVerificationEmail(
                email,
                username,
                verifyCode
            )
            if(!emailResponse.success){
                return Response.json({
                    success : false ,
                    message : emailResponse.message
                } , {status : 500})
            }else{
                return Response.json({
                    success : true ,
                    message : "User registered successfully, please verify your email"
                } , {status : 500})
            }
        }


    }catch(error){
        console.log("Error registering User" , error) ;
        return Response.json(
            {
                success : false ,
                message : "Error registering User"//sent at frontend
            },
            {
                status : 500
            }
        )
    }
}