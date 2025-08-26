import { generateToken } from "../lib/utils"
import User from "../models/User"
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
        if(!user){
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

        const token = generateToken(userData._id);
        return res.json({success:true, userData, token, message:"Successfully Logged In"})
    } catch (error) {
        console.error(error.message);
        return res.json({success:false, message:error.message})
    }
}

// authentication check
export const checkAuth = async() =>{
    return res.status(200).json({success:true, user:req.user})
}