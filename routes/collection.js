const express = require("express");
const app = express();
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudinary/index.js");
const upload = multer({
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

const { cloudinary } = require("../cloudinary");

const isLoggedIn = require("../utilities/isLoggedIn");
const catchAsync = require("../utilities/catchAsync");

const collection = require("../controllers/collection");

router
  .route("/")
  .get(isLoggedIn, catchAsync(collection.collectionPage))
  .post(
    isLoggedIn,
    upload.array("images"),
    catchAsync(collection.postNewPiece)
  );

router.get("/new", isLoggedIn, collection.newPieceForm);

router.post(
  "/export_collection",
  isLoggedIn,
  catchAsync(collection.exportToXlsx)
);

router
  .route("/show/:id")
  .get(isLoggedIn, catchAsync(collection.showPage))
  .put(isLoggedIn, upload.array("images"), catchAsync(collection.editPiece))
  .delete(isLoggedIn, catchAsync(collection.deletePiece));

router.get("/show/:id/edit", isLoggedIn, catchAsync(collection.editPieceForm));
router.get(
  "/show/:id/edit/images",
  isLoggedIn,
  catchAsync(collection.editImages)
);

module.exports = router;
