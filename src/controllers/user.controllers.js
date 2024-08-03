import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiErrors} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt  from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId)=>{
try {
   console.log('mi generateAccessAndRefreshToken');
  console.log(userId)
     const user = await User.findById(userId)
     console.log(user);
     
     const accessToken =  user.generateAccessToken()
     const refreshToken = user.generateRefreshToken()
     console.log(refreshToken)
     console.log(accessToken);
      user.refreshToken=refreshToken  //push in database but not till save
     await user.save({validateBeforeSave:false})
     
     return {accessToken,refreshToken}
     
} catch (error) {
   throw new ApiErrors(500,"Something went wrong while generating refresh and access token")
}
}



//register User
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
   
   const {username,email,password,fullName} = req.body
   console.log(email);
   console.log(username);
   
   if(
      [fullName,email,username,password].some((field)=>!field || field.trim()==="")
   ){
      throw new ApiErrors(400,"All fields are required")
   }

   const existedUser= await User.findOne({
      $or: [{username},{email}]
   })
   if(existedUser){
      throw new ApiErrors(409,"User with email or username is already exits")
   }

   const avatarLocalPath= req.files?.avatar[0]?.path
   //const coverImageLocalPath = req.files?.coverImage[0]?.path
   console.log(avatarLocalPath,"hi");
   let coverImageLocalPath
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
       coverImageLocalPath=req.files?.coverImage[0].path
       console.log(coverImageLocalPath,"imagecover");
   }

   if(!avatarLocalPath){
      throw new ApiErrors(400,"Avatar is required")
   }

   const avatar =await uploadOnCloudinary(avatarLocalPath)
   const coverImage =await uploadOnCloudinary(coverImageLocalPath)

   // if(!coverImage){
   //    throw new ApiErrors(400,"Cover Image is required")
   // }

   const user = await User.create({
      fullName,
      avatar:avatar.url,
      coverImage:coverImage?.url || "",
      fullName,
      email,
      username,
      password,
   })

   const CreatedUser=await User.findById(user._id).select(
      "-password -refreshToken"
   )
   
   if(!CreatedUser){
      throw new ApiErrors(500,"Something went wrong while regestring the user")
   }

   return res.status(201).json(
      new ApiResponse(200,CreatedUser,"user registered successfully")
   )   

})

//login user
const loginUser = asyncHandler(async (req,res)=>{
   // email or username and password 
   //authentication middleware kasa karshil?
   //refresh token and access token


   // req body-> data
   // username or email check
   //find the user 
   //password check
   //accesss and refresh token it user exist
   //send cookie
   
   const {username,email,password} = req.body

   console.log(username);
   console.log(email);

   if(!(username || email)){
      throw new ApiErrors(401,"please enter username or email")
   }

   const user = await User.findOne({
      $or:[{username},{email}]
   })
   if(!user){
      throw new ApiErrors(401,"User not exists")
   }

  const validPassword = await user.isPasswordCorrect(password)

  console.log(validPassword);
  if(!validPassword){
   throw new ApiErrors(401,"Password is not correct")
  }

  console.log('first time');
   console.log(user.id)
   console.log(user._id)
   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
console.log("Inlogin",accessToken,refreshToken);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
   httpOnly: true,
   secure: true
}

return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
   new ApiResponse(
       200, 
       {
           user: loggedInUser, accessToken, refreshToken
       },
       "User logged In Successfully"
   )
)



})


const logoutUser = asyncHandler(async(req,res)=>{
   //remove cookies
   //remove refresh and access token
   //

   //we can't take user id from hear

   await User.findByIdAndUpdate(
      req.user._id,
      {
         $set:{
            refreshToken:undefined
         }
      },
      {
         new:true
      }
   )

   const options={
      httpOnly:true,
      secure:true
   }

   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged Out"))


})

const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

  if(incomingRefreshToken){
   throw new ApiErrors(401,"Unauthoorized requrest")
  }

  try {
   const decodedToken=jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
 
   )
   const user = await User.findById(decodedToken?._id)
 
   if(!user){
    throw new ApiErrors(401,"Invalid refresh token")
   }
 
   if(incomingRefreshToken !== user?.refreshToken){
    throw new ApiErrors(401,"Refresh token is expired or used")
   }
 
   
   const {newrefreshToken,accessToken}= await generateAccessAndRefreshToken(user._id)
 
   const options={
    secure:true,
    httpOnly:true,
   }
 
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newrefreshToken,options)
   .json(new ApiResponse(
    200,
    {accessToken,refreshToken:newrefreshToken},
    "Access token refreshed"))
  } catch (error) {
   throw new ApiErrors("401",error?.message||"invalid refresh token");
   
  }
})


export {registerUser,loginUser,logoutUser,refreshAccessToken}

