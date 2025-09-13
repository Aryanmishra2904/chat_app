import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"; // ✅ import default
    


export const signup =  async (req,res)=>{
   const {fullname,email,password}=req.body
    try{
       //steps
       //1 - validating credentials like passwords and username
       //2 - hashing the passwords through bcrypt
       //3 -  genrate jwt tokens
       if(!fullname||!password||!email){
        return res.status(400).json({message : "all fields are require to signup"})
       }
       if(password.length < 6){
        return res.status(400).json({message : "password must be at least 6 characters"})
       }
       const user = await User.findOne({email})

       if(user) return res.status(400).json({message: "Email already exists"})

       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(password,salt)
       
       
       const newUser = new User({
        fullname,
        email,
        password:hashedPassword
       })
       if(newUser){
        generateToken(newUser._id,res)
        await newUser.save()

       res.status(201).json({
       message: "User created successfully",
       user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        password:hashedPassword
      }
    })

    }
       
       
    }catch (error){
        console.log("Error in signup controller",error.message)
         res.status(500).json({
            message :"Internl server error"
        }) 

    }

}

export const login = async (req,res)=>{
    const {email,password}=req.body
    try {
        // 1- find the user first
        // 2- if user founded then then check the password
        // 3- if thre is no email or password then there should be an error
        
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message : "User not found"})

        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password)
            if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid credentials"})
            }

            generateToken(user._id,res)

            res.status(200).json({
                 _id: user._id,
                  fullname: user.fullname,
                  email: user.email,
                  profilePic:user.profilePic
            })
        }
    
    
    catch (error) {
        console.log("Error in login controller",error.message)
         res.status(500).json({
            message :"Internl server error"
        })
        
    }
}

export const logout = (req,res)=>{
   // clear all the cookie for the logout
   try {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({
        message:"logged out successfully"
    })
   } catch (error) {
     console.log("Error in logout controller",error.message)
         res.status(500).json({
            message :"Internl server error"
        })
    
   }
}

export const updateProfile = async (req,res)=>{
    try {
        const {profilePic} = req.body
        const userId=req.user._id

        if(!profilePic){
            return res.status(401).json({
                message:"no profile pic to change"
            })
        }

        const UploadResponse = await cloudinary.uploader.upload(profilePic)
        const UpdateUser = await User.findByIdAndUpdate(
            userId,
            {profilePic:UploadResponse.secure_url},
            {new:true}
        )
        res.status(201).json({UpdateUser})
    } catch (error) {
        console.log("Error in updateProfile controller",error.message)
         res.status(500).json({
            message :"Internl server error"
        })
    
        
    }
}

export const checkAuth = (req,res)=>{
    try {
        res.status(201).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller",error.message)
         res.status(500).json({
            message :"Internl server error"
        })
    }
}