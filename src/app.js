import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'




const app = express()

app.use(cors({
    origin :process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:'16kb'})) //file upload limit
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public")) //local eg images stored in our images
//use of cookies
//cookies access and changes 
app.use(cookieParser())





//routes import
import userRouter from './routes/user.routes.js'


//routes declaration
app.use('/api/v1/users',userRouter)//only prefix

//http://localhost:8000/api/v1/users

export {app}



