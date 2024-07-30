import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from '../middlewares/mulder.middleware.js';
console.log(registerUser);
const router =Router()


console.log('tata');

router.route("/register").post(
    upload.fields([
        { name: 'avatar',
             maxCount: 1
        },
        {
            name:'coverImage',
            maxCount:1
        }
    ]),
    registerUser
)

export default router