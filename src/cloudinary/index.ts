import { v2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

export const cloudinary = v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    // @ts-ignore -- incomplete params type definition --
    folder: "artCollector",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});
