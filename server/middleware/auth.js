import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute = async(req, res, next)=>{
    try {
        let token;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            // handle missing or invalid token
            return res.status(401).json({ error: 'Authorization token missing or invalid' });
        }

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