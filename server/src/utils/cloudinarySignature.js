import cloudinary from "../config/cloudinary.js";

export const generateCloudinarySignature = (folder = "products") => {
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign = {
    timestamp,
    folder
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.API_SECRET
  );

  return {
    timestamp: timestamp,
    signature,
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.API_KEY,
    folder
  };
};
