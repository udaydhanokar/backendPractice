import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken } from "../controllers/user.controllers.js";
import { upload } from '../middlewares/mulder.middleware.js';
import {verifyJWT} from '../middlewares/auth.middleware.js'

console.log(registerUser);
const router =Router()


console.log('tata');

router.route("/register").post(
    upload.fields([
        {
         name: 'avatar',
         maxCount: 1 
        },
        { 
        name: 'coverImage',
        maxCount: 1
        }
    ]),

    registerUser
)


router.route("/login").post(loginUser)

//secured routes


router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
export default router