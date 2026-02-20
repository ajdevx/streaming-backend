import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

export const verifyJWT = asyncHandler(async(req,res,next) =>{
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
        throw new ApiError(401, "Unothorized request")
    }
    const decodedToken = jwt.verify(token,ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user) throw new ApiError(401, "Unothorized request")    

        req.user = user;
        next();
})