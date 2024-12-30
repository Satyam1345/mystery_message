import mongoose from "mongoose";
require('dotenv').config();



type ConnectionObject = {
    isConnected ?: number
}

const connection : ConnectionObject = {}
// here vvoid means that we dont care the type of data being recieved 
async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to database");
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '' , {})

        connection.isConnected =  db.connections[0].readyState
        console.log(db.connections[0])
        console.log(db.connections[0].readyState)
        console.log("BF Connected Successfully")
    }catch(error){
        console.log("Database Connection failed" , error)
        process.exit(1)
    }
}

export default dbConnect ;