import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"

// Controller for user Sign up
export const signup = async(req, res)=>{
    const {fullName, email, password, bio} = req.body
    try {
        if(!fullName || !email || !password || !bio){
            return res.json(
                {
                    success:false, 
                    message:"missing details"
                })}
        // data is valid, check if user already exists
        const user = await User.findOne({email})
        if(user){
            // console.log(user)
            return res.json({success:false, message:"User already Exists"})
        }
        // creating password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = await User.create({
            fullName, email, password:hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        return res.json({success:true,userData:newUser, token, message:"Account Created Successfully"})
        
    } catch (err) {
        console.log("ERRUR"+err.message)
        res.json({success:false, message:err.message})
        
    } 
}


// Controlller for user login
export const login = async(req, res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.json({success:false, message:"You inputted missing details"})
        }
        const userData = await User.findOne({email})
        if(!userData){
            return res.json({success:false, message:"User does not exists"})
        }

        // Comparing password
        const isPasswordCorrect = await bcrypt.compare(password,userData.password)
        if(!isPasswordCorrect){
            return res.json({success:false, message:"Password incorrect"})
        }

        const tokenen = generateToken(userData._id);
        return res.json({success:true, userData, token, message:"Successfully Logged In"})
    } catch (error) {
        console.error(error.message);
        return res.json({success:false, message:error.message})
    }
}

// authentication check
export const checkAuth = async(req, res) =>{
    return res.status(200).json({success:true, user:req.user})
}


// update user profile 
export const updateUserProfile= async (req, res) => {
    try {
        const {profilePic, bio, fullName} = req.body
        const userId = req.user._id
        let updatedUser;
        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {fullName,bio},{new:true})
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {fullName,bio, profilePic:upload.secure_url}, {new:true})
        }
        return res.status(200).json({success:true, user: updatedUser, message:"Updated Succefully"})
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:true, message:error.message})
    }
}