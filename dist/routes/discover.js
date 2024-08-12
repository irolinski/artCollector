"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const discover = require("../controllers/discover");
router.get("/:username", catchAsync(discover.discoverCollection));
router.get("/:username/pass_check", catchAsync(discover.passCheckForm));
router.post("/:username/pass_check", catchAsync(discover.passCheck));
router.get("/:username/verified/:token", catchAsync(discover.passVerified));
router.get("/:id/:id", catchAsync(discover.discoverPiece));
module.exports = router;
//# sourceMappingURL=discover.js.map