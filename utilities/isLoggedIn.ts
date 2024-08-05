import { NextFunction, Request, Response } from "express";
import { RequestWithLocalVariables } from "../definitions";

const isLoggedIn = (
  req: RequestWithLocalVariables,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You have to be logged in to do this.");
    return res.redirect("/home");
  }
  next();
};

module.exports = isLoggedIn;
