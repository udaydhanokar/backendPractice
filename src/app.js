import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//import routes

import userRouter from './routes/user.routes.js'
app.use("/api/v1/users", userRouter)


// import express from 'express'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'




// const app = express()

// app.use(cors({
//     origin :process.env.CORS_ORIGIN,
//     credentials:true
// }))

// app.use(express.json({limit:'16kb'})) //file upload limit
// app.use(express.urlencoded({extended:true,limit:"16kb"}))
// app.use(express.static("public")) //local eg images stored in our images
// //use of cookies
// //cookies access and changes 
// app.use(cookieParser())






// //import routes
// import userRegister from "./routes/user.routes.js"
// app.use("/api/v1/users",userRegister)

export {app}



