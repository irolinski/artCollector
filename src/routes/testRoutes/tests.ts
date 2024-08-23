import express from "express";
import catchAsync from "../../utilities/catchAsync";
const app = express();
const router = express.Router();



router.get(
  "/error-handling",
  catchAsync(async (req, res, next) => {
    throw new Error();
  })
);

export default router;
