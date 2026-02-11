import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name:"dvgocl14l",
    api_key:"387915323319523",
    api_secret:"qhT7Y2k-UZTigj_p4ooKMnMv8p0"
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