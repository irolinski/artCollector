const express = require("express");
const router = express.Router();

const ExpressError = require("./../utilities/ExpressError.js");
const catchAsync = require("./../utilities/catchAsync.js");

const discover = require("../controllers/discover.js");

router.get("/:username", catchAsync(discover.discoverCollection));

router.get("/:username/pass_check", catchAsync(discover.passCheckForm));

router.post("/:username/pass_check", catchAsync(discover.passCheck));

router.get("/:username/verified/:token", catchAsync(discover.passVerified));

router.get("/:id/:id", catchAsync(discover.discoverPiece));

module.exports = router;
