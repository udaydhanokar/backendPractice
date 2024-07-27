import mongoose,{Schema, Types} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoFile:{
            type:String, //cloudinary
            required:true,
        },

        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },
        thumbnail:{
            type:String //cloudinary 
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type:Number //cloudinar
        },
        views:{
            type:Number,
            default:0,
        },
        title:{
            type:String,
            required:true,
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        
    },{timestamps:true}
)



videoSchema.plugin(mongooseAggregatePaginate)//allow to write aggregration pipelines


export const Video = mongoose.model("Video",videoSchema)