import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    seen:{
        type:Boolean,
        default:false
    }
}, {timestamps:true})

export default Messages = mongoose.model("Messages", messageSchema)