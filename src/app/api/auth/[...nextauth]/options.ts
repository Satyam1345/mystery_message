import {NextAuthOptions} from "next-auth" ;
import  CredentialsProvider  from "next-auth/providers/credentials";

import bcrypt from "bcryptjs" 
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User";

export const authOptions : NextAuthOptions = {
    //refer to documentation on nextauth website, means what we are actually going to use for the login purposes, like actual credentials or google or github or linkedin 
    providers : [
        CredentialsProvider({
            id : "credentials",
            name : "Credentials",
            credentials: {
                email: { label: "Emal", type: "text", placeholder: "satyam@gmail.com" },
                password: { label: "Password", type: "password" }
              },

              async authorize(credentials : any) : Promise<any>{
                    await dbConnect() 

                    try{
                        const user = await UserModel.findOne({
                            $or : [
                                {email : credentials.identifier},
                                {username : credentials.identifier}
                            ]
                        })

                        if(!user){
                            throw new Error('No user found with this Email') 
                        }
                        if(!user.isVerified){
                            throw new Error('Please verify your account before login')
                        }

                        const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password)

                        if(isPasswordCorrect){
                            return user
                        }else{
                            throw new Error('Incorrect Password')
                        }

                    }catch(error : any)
                    {
                        throw new Error(error)
                    }
              }
        })
    ], 

    callbacks  :{
    
          async jwt({ token, user}) {
            console.log("My user is "  ,user) 
            console.log("My token is "  ,token) 
            if(user){
                // cant directly takke id field of user because here user is of next-auth, it has no such fields, to access the user we created, we can define the modifications in a separate file placed inside the TYPES folder->next-auth.d.ts file
                token._id = user._id?.toString() 
                token.isVerified = user.isVerified 
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token;
          },

          async session({ session, token }) {
            console.log("My session is "  ,session) 
            console.log("My token is "  ,token) 
            if(token)
            {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session ;
          },
    },

    // here we have made a dedicated path for signin for customisations, we can also use the defaults described on the website, thats easy and simple
    pages : {
        signIn : '/sign-in'
    },
    //token based strategy, take token either from the databaese of jwt
    session : {
        strategy : "jwt",
    },
    // secret key stored in .env
    secret : process.env.NEXT_AUTH_SECRET,

    debug : true 

}