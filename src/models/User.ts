import mongoose , {Schema , Document} from "mongoose" ;

export interface Message extends Document{
    content : string ; //string in Typescript starts from small letter
    createdAt : Date
}// this block only provides type safety to the document, so that by chance if we define content as number or any other data type otherr than string , then it will simply notify us , preventing the error

const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String , // String in mongoose starts from capital letter
        required : true 
    } , 
    createdAt : {
        type : Date,
        required : true ,
        default : Date.now
    }
})


export interface User extends Document { 
    username : string ; 
    email : string ;
    password : string ;
    verifyCode : string ;
    isVerified : boolean ,
    verifyCodeExpiry : Date ; 
    isAcceptingMessage : boolean;
    messages : Message[]
}
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const emailRegexSimple = /^\S+@\S+\.\S+$/ ;

const UserSchema : Schema<User> = new Schema ({
    username : {
        type : String,
        required : [true , "Username is required"],
        trim : true ,
        unique : true 
    },
    email : {
        type : String,
        required : [true , "Email is required"],
        unique : true,
        match : [ emailRegexSimple , 'please use a valid email address!!!']
    },
    password : {
        type : String , 
        required : [true , "Password is required"] 
    },
    verifyCode : {
        type : String , 
        required : [true , "Verify code is required"]
    },
    verifyCodeExpiry : {
        type : Date ,
        required :  [true , "Verify code Expiry is required"]
    } ,
    isVerified : {
        type : Boolean , 
        default  :false 
    },
    isAcceptingMessage : { 
        type : Boolean , 
        default : true 
    } ,
    messages :  [MessageSchema]
    
})

//already hai model || model nhi hai, model banana padega
// Nextjs does not know the application is runnign for the first time or has already been initialised earlier
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , UserSchema))