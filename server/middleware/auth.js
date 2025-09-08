import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute = async(req, res, next)=>{
    try {
        const token = req.headers.token
        // i could also do req.header.authorization.split(' ')[1] and have validation check

        //we need the user _id ... so we decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        // find user with user id and don't return password back (exclude pswrd)
        const userData = await User.findById(decodedToken.userId).select("-password")
        if(!userData){
            return res.json({success:false, message:"User not found"})
        }
        // add the userData to req
        req.user = userData;
        next();
    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message:error.message})
    }
}