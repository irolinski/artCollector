"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
exports.cloudinary = cloudinary_1.v2;
exports.cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
exports.storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: exports.cloudinary,
    params: {
        folder: "artCollector",
        allowedFormats: ["jpeg", "png", "jpg"],
    },
});
//# sourceMappingURL=index.js.map