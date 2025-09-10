import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userScoketMap } from "../server.js";

// get all users except looged in users
export const getUsersForSidebar = async(req, res)=>{
    try {
        const userId = req.user._id
        const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password")
        // $ne means not equal

        // count number of messages not seen by the reciever(which is the userId)
        const unseenMessages ={};
        await Promise.all( 
            filteredUsers.map(async(otherUsers)=>{
            const messages = await Message.find({senderId:otherUsers._id,recieverId:userId, seen:false})
            if(messages.length>0){
                unseenMessages[userId] = messages.length
            }})
        )

        res.status(200).json({success:true, users:filteredUsers, unseenMessages})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({success:false,message:error.message})
    }
}

/**
  another way i can implement the same thing
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all users except the current one, without the password field
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');

    // Bulk query to count unseen messages for each user, grouped by receiverId
    const unseenMessages = {};
    const messages = await Message.aggregate([
      { 
        $match: {
          recieverId: userId,
          seen: false
        }
      },
      { 
        $group: {
          _id: '$senderId',
          count: { $sum: 1 }
        }
      }
    ]);

    // Map the message counts to the users
    messages.forEach((msg) => {
      unseenMessages[msg._id] = msg.count;
    });

    // Return the response
    res.status(200).json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

 */



// Get all message for selected User
export const getMessages = async(req, res)=>{
    try {
        // person we want to chat with
        const {id:selectedUserId} = req.params;
        //  us
        const myId = req.user._id;
        // messages between us
        const messages = await Message.find({
            $or:[
                {senderId:myId,recieverId:selectedUserId},
                {senderId:selectedUserId, recieverId:myId}
            ]
        })
        // mark those messages as true
        await Messsage.updateMany({senderId:selectedUserId,recieverId:myId}, {seen:true})
        res.status(200).json({success:true,messages,message:"got the messages"})
    } catch (error) {
        console.error('some error here')
        res.status(500).json({success:false,message:error.message})
    }
}



// api to mark  message as seen  using message id 
export const markMessagesAsSeen = async(req,res)=>{
  try {
    const {id} = req.params;
    await Message.findByIdAndUpdate(id, {seen:true})
    res.json({success:true})
  } catch (error) {
    // console.error(error.message);
    res.json({success:false, message:error.message})
  }
}


// sending the message to the person

export const sendMessage = async(req, res)=>{
  try {
    const recieverId = req.params.id;
    const senderId = req.user._id;
    const {text, image} = req.body
    let imageUrl;
    if(image){
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
      // better way would be cloudinary.uploader.upload(image).then(up=>{imageUrl =up.secure_url}).catch(err=>console.error(err))
    }
    const newMessage = Message.create({
      senderId,
      recieverId,
      text,
      image:imageUrl
    })

    // Emit the message to the receiver socket
    const receiverSocketId = userScoketMap[recieverId]
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }

    res.status(200).json({success:true, newMessage})

  } catch (error) {
    res.status(500).json({success:false,message:error.message})
  }
}