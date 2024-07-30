import mongoose ,{Schema} from "mongoose"
import jwt from 'json-web-token'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        
        username:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true //for better searching
        },
        fullName:{
            type:String,
            require:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        password:{
            type:String, //encript password
            require:[true,'Password is required']
        },
        watchHistory:[{
            type:Schema.Types.ObjectId,
            ref:"Video"
        }],
        coverImage:{
            type:String, //cloudinary url
        
        },
        avatar:{
            type:String ,//cloudinary url
            required:true,
        },
        refreshToken:{
            type:String,    
        }

        
    },{timestamps:true}
)
//pre is a method in middlepare
    userSchema.pre("save",async function(next){
        if(!this.isModified("password") ) return next();
        
    console.log("hi mi Uday ",this.username=username);
        this.password = await bcrypt.hash(this.password,10)
        next()
    })

    userSchema.methods.isPasswordCorrect/*userSchema madhe apan he method takli isPassword correct ani logic lihla*/ = async function (password){
       return await bcrypt.compare(password,this.password)
    }
    // console.log("hi mi Uday ",this.username=username);

    userSchema.methods.generateAccessToken=function(){
        
    console.log("hi mi Uday ",this.username=username);
       return jwt.sign(
            {
                _id:this._id,
                email:this.email,
                username:this.username,
                fullName:this.fullName

            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    }

    userSchema.methods.generateRefreshToken=function(){
        
        console.log("hi mi Uday ",this.username=username);
           return jwt.sign(
                {
                    _id:this._id,
                   
    
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
                }
            )
        }

 export const User = mongoose.model("User",userSchema)

