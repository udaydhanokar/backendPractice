
import { asyncHandler } from "../utils/asyncHandler.js";
// import User from '../models/user.models.js'

const registerUser = asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:'ok'
    })
    // const{username,email,fullName,avatar,coverImage}=req.body
    // const user = await User.-id
})

/*
    data ghetla
    mn save karacha ahe db  --kasa karshil
    object madhe purna user save karacha 
*/
export {registerUser}