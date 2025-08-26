import mongoose from "mongoose";

// Function to connenct mongodb database

export const connectDb = async () =>{
    try{
        // event listener
        mongoose.connection.on('connected', ()=>console.log('Database Connected '))
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    }catch(err){
        console.log(err)
    }
}