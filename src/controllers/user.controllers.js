import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiErrors} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

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
   const incomingrefreshtoken = req.cookies?.refreshToken || req.body.refreshToken
   if(!incomingrefreshtoken){
      throw new ApiErrors("401","unauthorized request");  
   }

   const decodedToken = jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
   console.log(decodedToken);

   const user = await User.findById(decodedToken?._id)
   if(!user){
      throw new ApiErrors(401,"invalid refresh token")
   }

   if(incomingrefreshtoken!==user?.refreshToken){
      throw new ApiErrors("401","Refresh token is expired or used")
   }

   const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)

   console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu",accessToken,"ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",refreshToken);
   
   const options ={
      secure:true,
      httpOnly:true
   }

   return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken},
                "Access token refreshed"
            )
         )

})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
   const {oldPassword,newPassword,conformPassword} = req.body

   console.log('change Current Password');
   
   const user = await User.findById(req.user._id)
   console.log(user,"changeCurrentPassword");

   if(!user){
      throw new ApiErrors(401,"unauthorized access")
   }
console.log(user.password);

  
   const validPassword = await user.isPasswordCorrect(oldPassword)

   console.log(validPassword);
   if(!validPassword){
      throw new ApiErrors(401,"please enter a valid password")
   }
   
   if(newPassword !== conformPassword){
      throw new ApiErrors(401,"please enter correct new password")
   }

   user.password = newPassword
   await user.save({validateBeforeSave:false})

 return res
.status(200)
.json(new ApiResponse(200,{},"Password changed successfully"))
   

})

const getCurrentUser = asyncHandler(async(req,res)=>{
   console.log("getCurrentUser");
   
   console.log(req.user);
   
   return res
   .status(200)
   .json(200,req.user,"current user fetched successfully")   
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
   const{fullName,email,username} = req.body
   if(!(fullName||email||username)){
      throw new ApiErrors(401,"please fill the data")
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            fullName:fullName,
            email:email,
            username:username
         }
      },
      {new:true}

   ).select("-password")

   return res
   .status(200)
   .json(
      new ApiResponse(200,user,"Cover Image Updated successfully")
   )
})


const updateUserAvatar = asyncHandler(async(req,res)=>{
   
   const avatarLocalPath = req.file?.path
   
   if(!avatarLocalPath){
      throw new ApiErrors(400,"Avaar file is missing")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
  
   if(!avatar.url){
      throw new ApiErrors(400,"Failed to upload avatar")
   }

  const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            avatar:avatar.url
         }
      },
      {new:true}
   ).select("-password")

   return res
   .status(200)
   .json(
      new ApiResponse(200,user,"Cover Image Updated successfully")
   )


})


const updateUserCoverImage = asyncHandler(async(req,res)=>{
   
   const coverImageLocalPath = req.file?.path
   
   if(!coverImageLocalPath){
      throw new ApiErrors(400,"Avatar file is missing")
   }

   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  
   if(!coverImage.url){
      throw new ApiErrors(400,"Failed to upload avatar")
   }

   const user =await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            coverImage:coverImage.url
         }
      },
      {new:true}
   ).select("-password")


   return res
   .status(200)
   .json(
      new ApiResponse(200,user,"Cover Image Updated successfully")
   )
})



export {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   changeCurrentPassword,
   getCurrentUser,
   updateAccountDetails,
   updateUserAvatar,
   updateUserCoverImage,

}

