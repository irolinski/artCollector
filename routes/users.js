"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const catchAsync_1 = __importDefault(require("../utilities/catchAsync"));
const isLoggedIn_1 = __importDefault(require("../utilities/isLoggedIn"));
const user_1 = __importDefault(require("../models/mongoose/user"));
const passport_1 = __importDefault(require("passport"));
passport_1.default.serializeUser(user_1.default.serializeUser());
passport_1.default.deserializeUser(user_1.default.deserializeUser());
const users_1 = require("../controllers/users");
const router = express_1.default.Router();
router.get("/server-check", users_1.serverCheck);
router.get("/", users_1.redirectHome);
router.get("/home", users_1.home);
router.post("/register", users_1.register);
router.post("/login", passport_1.default.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/home",
}), users_1.login);
router.get("/preferences", isLoggedIn_1.default, users_1.preferences);
router.put("/preferences/edit", isLoggedIn_1.default, (0, catchAsync_1.default)(users_1.editUser));
router.put("/preferences/change_password", isLoggedIn_1.default, (0, catchAsync_1.default)(users_1.changePassword));
router.get("/logout", users_1.logoutUser);
router.post("/forgotten", (0, catchAsync_1.default)(users_1.forgottenPassword));
router.route("/password_reset/:id/:token").get(users_1.sendToken).post(users_1.resetPassword);
router
    .route("/preferences/deleteAcc")
    .get(isLoggedIn_1.default, users_1.deleteAcc)
    .delete(passport_1.default.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/preferences",
}), isLoggedIn_1.default, (0, catchAsync_1.default)(users_1.deleteAccConfirmed));
exports.default = router;
//# sourceMappingURL=users.js.map