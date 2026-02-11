import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        minlength:3,
        maxlength:30,
        index: true  //if it is indexed search will be faster
    },
    email:{  
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index: true
    },
    avatar:{
        type:String,// cloudinary url
        required: true
    },
    coverImage:{
        type:String,// cloudinary url
    },
    watchHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type:String,
        required:[true, "password is required"],
        minlength:6,
        maxlength:128
    },
    refreshToken:{
        type:String
    }
    
},{timestamps:true})

userSchema.pre("save", async function(){
    if(!this.isModified("password")) return; // if password is not modified then we will not hash it again
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
   return await jwt.sign(
        {_id: this._id,
         email: this.email,
         username: this.username,
         fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN}
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {_id: this._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN}
    )
}
export const User = mongoose.model("User", userSchema)
