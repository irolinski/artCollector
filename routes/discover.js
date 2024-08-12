"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const catchAsync_1 = __importDefault(require("../utilities/catchAsync"));
const discover_1 = require("../controllers/discover");
const router = express_1.default.Router();
router.get("/:username", (0, catchAsync_1.default)(discover_1.discoverCollection));
router.get("/:username/pass_check", (0, catchAsync_1.default)(discover_1.passCheckForm));
router.post("/:username/pass_check", (0, catchAsync_1.default)(discover_1.passCheck));
router.get("/:id/:id", (0, catchAsync_1.default)(discover_1.discoverPiece));
exports.default = router;
//# sourceMappingURL=discover.js.map