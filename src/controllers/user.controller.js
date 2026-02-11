import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async(req,res) =>{
    const {fullName, email, password, username} = req.body;
    
    //validation for required fields
    if ( [fullName, email, password, username].some((field) => field?.trim() === "")) {
        throw new ApiError(400,"All fields are required");
    }
    if(!email.includes("@")) throw new ApiError(400,"Invalid email address");
    //check if user already exist
    const existingUser = await User.findOne({
        $or:[{email},{username}] // learn aout $or operator in mongoose
    })
    if(existingUser) throw new ApiError(409,"User with email or username already exists" );
    //taking image path from multer middleware
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    //chacking avatar image is uploaded or not
    if(!avatarLocalPath) throw new ApiError(400,"Avatar image is required");

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);
   
    if(!avatar) throw new ApiError(400,"Avatar image is required");

    //saving user to database
    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })

    //checking that user is created or not
    const createdUser = await User.findById(user._id).select((
        "-password -refreshToken"
    ))

    if(!createdUser) throw new ApiError(500,"User registration failed");

    return res.status(201).json(new ApiResponse(
        200,createdUser, "User registered successfully")
    )
})


export {registerUser}