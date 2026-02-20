import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';


const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user =await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    }catch(error){
        throw new ApiError(500,"Token generation failed");
    }
}

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
    // throw new ApiError(500,"checking");

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

//login user
const loginUser = asyncHandler(async(req,res) =>{
    //req.body --> data
    //username or email and password
    //validation for required fields
    //find user
    //password check
    //access and refresh token and send both to user
    //send it into cookies and successfully login response

    const {email, password, userName} = req.body;

    if(!userName || !email) throw new ApiError(400,"Username or email is required");
  const user = await User.findOne({
        $or:[{email},{userName}]
    })
    if(!user) throw new ApiError(404,"User not found");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) throw new ApiError(401,"Invalid password");
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findByIdAndUpdate().select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
              .cookie("accessToken", accessToken, options)
              .cookie("refreshToken", refreshToken, options)
              .json(
                new ApiResponse(200, 
                    {user:loggedInUser, accessToken, refreshToken},
                    "User logged in successfully"
                )
              )

})

//logout user
const logoutUser = asyncHandler(async(req,res) =>{
    //clear cookies and send response
    
    })


export {registerUser, loginUser}