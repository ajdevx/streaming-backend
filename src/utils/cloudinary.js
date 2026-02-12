import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
console.log("Cloudinary config check:", cloudinary.config());



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        //file has been uploaded successfully
        console.log("file has been uploaded successfully", response.url);
        return response;
    } catch (error) {
        console.log("error while uploading file to cloudinary", error);
       fs.unlinkSync(localFilePath) // delete the file from local storage
       return null; 
    }
}

export {uploadOnCloudinary}