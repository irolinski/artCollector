import { NextFunction, Request, Response } from "express";
import { Error, RequestWithLocalVariables } from "../definitions";
import { UserModel, UserModelWithMongooseMethods } from "../models/definitions";
import userCheckUndefined from "../utilities/userCheckUndefined";
import sendEmail from "../utilities/sendEmail";
import ArtPiece from "../models/mongoose/artPiece";
import User from "../models/mongoose/user";
import passport from "passport";
import JWT from "jsonwebtoken";
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const { cloudinary } = require("../cloudinary/index");

export const serverCheck = (req: Request, res: Response) => {
  res.status(200).json({ message: "running" });
};

export const redirectHome = (req: Request, res: Response) => {
  res.redirect("/home");
};

export const home = (req: Request, res: Response, next: NextFunction) => {
  const pageTitle = "Homepage - artCollector";
  const styleSheet = "homepage";

  res.render("homepage", { pageTitle, styleSheet });
};

export const register = async (
  req: RequestWithLocalVariables,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email: `${email}`, username: `${username}` });
    const registeredUser = await User.register(user, password);

    sendEmail(
      email,
      "Welcome to artCollector",
      `Hi,
        Welcome to our site!

        Just wanted to let you know: 
        if you're having any problems or want to provide info on any bugs: reach us under artcollector.messages@gmail.com.

        This should be the first and the last automatic message you'll ever get from us.

        We wish you all the best, 
        artCollector team
      `
    );

    req.login(registeredUser, (err: Error) => {
      if (err) throw err;
      req.flash("success", "Welcome!");
      res.redirect("/collection");
    });
  } catch (err) {
    req.flash("error", `${err.message}. Try again, please!`);
    res.redirect("/home");
    next(err);
  }
};

export const login = (req: RequestWithLocalVariables, res: Response) => {
  req.flash("success", "Welcome back!");
  res.redirect("/collection");
};

export const preferences = (req: Request, res: Response) => {
  const pageTitle = "Preferences - artCollector";
  const styleSheet = "forms";

  res.render("preferences", { pageTitle, styleSheet });
};

export const editUser = async (
  req: RequestWithLocalVariables,
  res: Response,
  next: NextFunction
) => {
  try {
    userCheckUndefined(req);

    if (req.body.custom_table) {
      await User.findOneAndUpdate(req.user._id, {
        custom_table: req.body.custom_table,
      });
    } else {
      await User.findOneAndUpdate(req.user._id, {
        username: req.body.username,
        email: req.body.email,
        show_name: req.body.show_name,
        contact_info: req.body.contact_info,
        share_collection: req.body.share_collection,
        share_pass: req.body.share_pass,
      });
    }
    if (req.body.share_collection === "1") {
      req.flash("success", "Now, generate a link by clicking the share icon!");
    } else {
      req.flash("success", "Your changes have been saved!");
    }
    res.redirect("/collection");
  } catch (err) {
    req.flash("error", `${err.message}. Try again, please!`);
    res.redirect("/preferences");
    next(err);
  }
};

export const changePassword = async (
  req: RequestWithLocalVariables,
  res: Response,
  next: NextFunction
) => {
  userCheckUndefined(req);
  try {
    User.findOne({ username: req.user.username }).then(
      (u: UserModelWithMongooseMethods) => {
        u.setPassword(
          req.body.new_password,
          (err: Error, u: UserModelWithMongooseMethods) => {
            if (err) {
              throw err;
            } else {
              u.save();
              res.status(200).json({ message: "password change successful" });
            }
          }
        );
        req.flash(
          "success",
          "Your password has been changed. Next time you log in, use your new password!"
        );
        res.redirect("/collection");
      }
    );
  } catch (err) {
    next(err);
  }
};

export const logoutUser = (
  req: RequestWithLocalVariables,
  res: Response,
  next: NextFunction
) => {
  req.logout(function (err: Error) {
    if (err) {
      next(err);
    } else {
      req.flash("success", "Goodbye!");
      res.redirect("/home");
    }
  });
};

export const forgottenPassword = async (
  req: RequestWithLocalVariables,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const origin = req.headers.origin;

  await User.findOne({ email: email }).then((u: UserModel) => {
    if (u) {
      const secret = process.env.JWT_SECRET + u.password;
      const payload = {
        email: u.email,
        id: u._id,
      };
      const token = JWT.sign(payload, secret, { expiresIn: "15m" });
      const link = `${origin}/password_reset/${u._id}/${token}`;
      sendEmail(
        u.email,
        "Password Reset",
        `Hi,

            It seems that you have requested a password reset. 
            If you want to proceed: click the link below and follow the instructions. 
            The link will be available for 15 minutes only. 

            ${link}

            Take care, 
            artCollector team
          `
      );
      req.flash(
        "success",
        "An email with furhter instructions has been sent to the provided adress."
      );
      res.redirect("/home");
    } else {
      req.flash("error", "Invalid e-mail adress. Try again!");
      res.redirect("/home");
    }
  });
};

export const sendToken = (
  req: RequestWithLocalVariables,
  res: Response,
  next: NextFunction
) => {
  const { id, token } = req.params;

  User.findById(id).then((u: UserModel) => {
    if (u) {
      if (!u) {
        req.flash("error", "Invalid id!");
        res.redirect("/home");
      } else {
        const secret = process.env.JWT_SECRET + u.password;
        try {
          const payload = JWT.verify(token, secret);
          res.render("password_reset", {
            email: u.email,
            pageTitle: "Password reset - artCollector",
            styleSheet: "forms",
          });
        } catch (error) {
          res.send(error.message);
        }
      }
    } else {
      req.flash(
        "error",
        "We encountered a mistake: no such user id. Please, try again."
      );
      res.redirect("/home");
    }
  });
};

export const resetPassword = (
  req: RequestWithLocalVariables,
  res: Response,
  next: NextFunction
) => {
  const { id, token } = req.params;
  User.findById(id).then((u: UserModelWithMongooseMethods) => {
    u.setPassword(
      req.body.new_password,
      (err: Error, u: UserModelWithMongooseMethods) => {
        if (err) next(err);
        u.save();
        res.status(200).json({ message: "password change successful" });
      }
    );
    req.flash(
      "success",
      "Your password has been changed. Next time you log in, use your new password!"
    );
    res.redirect("/home");
  });
};

export const deleteAcc = (req: Request, res: Response, next: NextFunction) => {
  const pageTitle = "Delete account - art Collector";
  const styleSheet = "forms";
  res.render("preferences_deleteAcc", { pageTitle, styleSheet });
};

export const deleteAccConfirmed = async (
  req: RequestWithLocalVariables,
  res: Response,
  next: NextFunction
) => {
  userCheckUndefined(req);

  const pieces = await ArtPiece.find({ user_id: req.user._id });
  for (let p of pieces) {
    for (let img of p.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
  await ArtPiece.deleteMany({ user_id: req.user._id });
  await User.findByIdAndDelete(req.user._id);
  req.flash("success", "Goodbye :(");
  res.redirect("/home");
};
