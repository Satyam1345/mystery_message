import {z} from 'zod' ;

export const usernameValidation = 
    z.
    string().
    min(3 , "Username must be 2 characters").
    max(20 , "Username must be no more than 20 characters").
    regex(/^[a-zA-Z0-9_]+$/ , "Username must not contain speical charactes")

export const signUpSchema = z.object({
    username : usernameValidation ,
    email : z.string().email({message : 'Invalid Email Address'}),
    password : z.string().min(6 , {message : "password must be atleast 6 character"})
})


