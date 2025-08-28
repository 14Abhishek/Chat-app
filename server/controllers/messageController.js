

// get all users except looged in users
export const getUsersForSidebar = async()=>{
    try {
        const userId = req.user._id
        const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password")
        // count number of messages not seen
        
    } catch (error) {
        
    }
}