const express = require("express");
const router = express.Router();

const catchAsync = require("../utilities/catchAsync");
const isLoggedIn = require("../utilities/isLoggedIn");

const User = require("../models/mongoose/user");

const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const users = require("../controllers/users");

router.get("/", users.redirectHome);

router.get("/home", users.home);

router.post("/register", users.register);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/home",
  }),
  users.login
);

router.get("/preferences", isLoggedIn, users.preferences);

router.put("/preferences/edit", isLoggedIn, catchAsync(users.editUser));

router.put(
  "/preferences/change_password",
  isLoggedIn,
  catchAsync(users.changePassword)
);

router.get("/logout", users.logoutUser);

router.post("/forgotten", catchAsync(users.forgottenPassword));

router
  .route("/password_reset/:id/:token")
  .get(users.sendToken)
  .post(users.resetPassword);

router
  .route("/preferences/deleteAcc")
  .get(isLoggedIn, users.deleteAcc)
  .delete(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/preferences",
    }),
    isLoggedIn,
    catchAsync(users.deleteAccConfirmed)
  );

module.exports = router;
