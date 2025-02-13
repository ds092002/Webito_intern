import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

// configuration
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key:CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const respons = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // File upload succeeded
    console.log("File has upload in cloudinary", respons.url);
    return respons.response;
  } catch (error) {
    // remove the local saved temporary file as the upload operation got failer
    fs.unlinkSync(localFilePath);
    return null;
  }
};
