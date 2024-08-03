import { ApiErrors } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {

        console.log(req.cookies.accessToken);
        
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        
        console.log(token,"token");
        if (!token) {
            throw new ApiErrors(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiErrors(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid access token")
    }
    
})















// import { ApiErrors } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken"
// import {User} from "../models/user.models.js"

// export const verifyJWT = asyncHandler(async (req, _,next)=>{
// try {
//   const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
  
//     if(!token){
//       throw new ApiErrors(401,"Unauthorized request")
//     }
//     console.log(token);
//     console.log('authh');
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//     console.log(decodedToken.id);
//     const user = await User.findById(decodedToken?._id).select(
//       "-password -refreshToken"
//     )
//     console.log(user.username)
  
//     if(!user){
//       throw new ApiErrors(401,"Invalid Access Token")
//     }
  
//     req.user= user;
  
//     next()
// } catch (error) {
//   throw new ApiErrors(401,error?.message || "Invalid Access Token")
// }
// })