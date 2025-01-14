import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" }); // Load environment variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("No file path provided for Cloudinary upload.");
      return null;
    }

    console.log(`Uploading file to Cloudinary: ${localFilePath}`);
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded to Cloudinary:", response.secure_url);

    // Clean up the temporary file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(`Temporary file deleted: ${localFilePath}`);
    } else {
      console.warn(`File not found for deletion: ${localFilePath}`);
    }

    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log(`Temporary file deleted after error: ${localFilePath}`);
    } else {
      console.warn(`Temporary file not found during error handling: ${localFilePath}`);
    }

    return null;
  }
};

export { uploadOnCloudinary };
