import { Request } from "express";
import { CustomFile } from "../definitions";
import express from "express";
import isLoggedIn from "../utilities/isLoggedIn";
import catchAsync from "../utilities/catchAsync";
import multer from "multer";
import { storage } from "../cloudinary/index";
import {
  collectionPage,
  postNewPiece,
  newPieceForm,
  exportToXlsx,
  showPage,
  editPiece,
  deletePiece,
  editPieceForm,
  editImages,
} from "../controllers/collection";

const app = express();
const router = express.Router();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000,
    files: 1,
  },
  fileFilter: function (
    req: Request,
    file: CustomFile,
    cb: (err: Error, bool?: boolean) => void
  ) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

router
  .route("/")
  .get(isLoggedIn, catchAsync(collectionPage))
  .post(isLoggedIn, upload.array("images"), catchAsync(postNewPiece));

router.get("/new", isLoggedIn, newPieceForm);
router.post("/export_collection", isLoggedIn, catchAsync(exportToXlsx));
router
  .route("/show/:id")
  .get(isLoggedIn, catchAsync(showPage))
  .put(isLoggedIn, upload.array("images"), catchAsync(editPiece))
  .delete(isLoggedIn, catchAsync(deletePiece));
router.get("/show/:id/edit", isLoggedIn, catchAsync(editPieceForm));
router.get("/show/:id/edit/images", isLoggedIn, catchAsync(editImages));

export default router;
