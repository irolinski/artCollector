"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isLoggedIn_1 = __importDefault(require("../utilities/isLoggedIn"));
const catchAsync_1 = __importDefault(require("../utilities/catchAsync"));
const multer_1 = __importDefault(require("multer"));
const collection_1 = require("../controllers/collection");
const app = (0, express_1.default)();
const router = express_1.default.Router();
const { storage } = require("../cloudinary/index");
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5000000,
        files: 1,
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|png|gif)$/)) {
            return cb(new Error("Only image files are allowed!"));
        }
        cb(null, true);
    },
});
const { cloudinary } = require("../cloudinary/index");
router
    .route("/")
    .get(isLoggedIn_1.default, (0, catchAsync_1.default)(collection_1.collectionPage))
    .post(isLoggedIn_1.default, upload.array("images"), (0, catchAsync_1.default)(collection_1.postNewPiece));
router.get("/new", isLoggedIn_1.default, collection_1.newPieceForm);
router.post("/export_collection", isLoggedIn_1.default, (0, catchAsync_1.default)(collection_1.exportToXlsx));
router
    .route("/show/:id")
    .get(isLoggedIn_1.default, (0, catchAsync_1.default)(collection_1.showPage))
    .put(isLoggedIn_1.default, upload.array("images"), (0, catchAsync_1.default)(collection_1.editPiece))
    .delete(isLoggedIn_1.default, (0, catchAsync_1.default)(collection_1.deletePiece));
router.get("/show/:id/edit", isLoggedIn_1.default, (0, catchAsync_1.default)(collection_1.editPieceForm));
router.get("/show/:id/edit/images", isLoggedIn_1.default, (0, catchAsync_1.default)(collection_1.editImages));
exports.default = router;
//# sourceMappingURL=collection.js.map