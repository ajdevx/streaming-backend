import mongoose, { trusted } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String, // cloudinary url
        required:true
    },
    tumbnail:{
        type:String,  // cloudinary url  
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number, // in seconds cloudinary url
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate) // mongoose plugin for pagination in aggregate query

export const Video = mongoose.model("Video", videoSchema)