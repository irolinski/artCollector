import express from "express";
import catchAsync from "../utilities/catchAsync";
import isLoggedIn from "../utilities/isLoggedIn";
import User from "../models/mongoose/user";
import passport from "passport";
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

import {
  redirectHome,
  home,
  register,
  login,
  preferences,
  editUser,
  changePassword,
  logoutUser,
  forgottenPassword,
  sendToken,
  resetPassword,
  deleteAcc,
  deleteAccConfirmed,
  serverCheck,
} from "../controllers/users";

const router = express.Router();

router.get("/server-check", serverCheck);
router.get("/", redirectHome);
router.get("/home", home);
router.post("/register", register);
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/home",
  }),
  login
);
router.get("/preferences", isLoggedIn, preferences);
router.put("/preferences/edit", isLoggedIn, catchAsync(editUser));
router.put(
  "/preferences/change_password",
  isLoggedIn,
  catchAsync(changePassword)
);
router.get("/logout", logoutUser);
router.post("/forgotten", catchAsync(forgottenPassword));
router.route("/password_reset/:id/:token").get(sendToken).post(resetPassword);
router
  .route("/preferences/deleteAcc")
  .get(isLoggedIn, deleteAcc)
  .delete(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/preferences",
    }),
    isLoggedIn,
    catchAsync(deleteAccConfirmed)
  );

export default router;
