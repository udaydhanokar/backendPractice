//require('dotenv').conig({path:'./env'})

import dotenv from 'dotenv'
import connectDB from './db/index.js';

dotenv.config({
    path:'./env'
})


import express from 'express'
const app =express()






connectDB()

// ;import { DB_NAME } from './constants';
// (async ()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         //professniol approch  app is always listening
//         app.on("error",(error)=>{
//             console.log("application is not able to talk with DATABASE",error);
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
 
//     } catch (error) {
//         console.log(error,"MongoDB not connected")
//     }
// })()