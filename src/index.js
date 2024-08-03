//require('dotenv').conig({path:'./env'})

import dotenv from 'dotenv'
import connectDB from './db/index.js';
import { app } from './app.js';


dotenv.config({
    path:'./.env'
})








connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8080,()=>{
        console.log(`Server is running/listening at port:${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGODB connect failed !!!",err);
})










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