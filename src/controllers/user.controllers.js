import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiErrors} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{
   //steps
   //data ghel req.body throw
   //check karel all data validation
   //nahi ala ta check karel
   //file and cover Image la pn handle karel
   // user cha object banvel with all content
   // database madhe push karel


   //get user details from frontend
   //validation - not empty
   //check if user already exists:username,email
   //check for images, checck for avatar
   //upload them to cloudinary,avatar
   //create user object - create entry in db
   //remove password and refresh token field from response


   const {username,email,fullName,password}=req.body
    
   console.log(email);
  if(
   [fullName,email,username,password].some((field)=>field?.trim()==="")
  ){
   throw new ApiErrors(400,"All fields are required")
  }
const existingUser=await User.findOne({
   $or:[{username},{email}]
})

if(existingUser){
   throw new ApiErrors(409,"User with email or username is already exists")
}
   const avatarLocatPath=req.files?.avatar[0]?.path;
   const coverImagePath = req.files?.coverImage[0]?.path;

   if(!avatarLocatPath){
      throw new ApiErrors(400,"Avatar file is requuired")
   }

   console.log(avatarLocatPath);

  const avatar=await uploadOnCloudinary(avatarLocatPath)
   console.log(avatar);
   const coverImage= await uploadonCloudinary(coverImagePath)
   console.log(coverImage);

   if(!avatar){
      throw new ApiErrors(400,"Avatar file is requuired")
   }


   const user = await User.create({
      fullName,
      avatar:avatar.url,
      coverImage:coverImage?.url || "",
      email,
      password,
      username:username.toLowerCase()
   })

   console.log(user);
  const createdUser=await User.findById(user._id).select(
   "-password -refreshToken"
  )
  if
  (!createdUser){
      throw new ApiErrors(500,"Something went wrong while resistrering")
  }

   return res.status(201).json(
      new ApiResponse(200,createdUser,"User registered Successfully")
   )


})
export {registerUser}

