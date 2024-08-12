import express from "express";
import catchAsync from "../utilities/catchAsync";
import {
  discoverCollection,
  passCheckForm,
  passCheck,
  discoverPiece,
} from "../controllers/discover";

const router = express.Router();

router.get("/:username", catchAsync(discoverCollection));
router.get("/:username/pass_check", catchAsync(passCheckForm));
router.post("/:username/pass_check", catchAsync(passCheck));
// router.get("/:username/verified/:token", catchAsync(passVerified));
router.get("/:id/:id", catchAsync(discoverPiece));

export default router;
