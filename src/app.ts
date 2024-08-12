import { NextFunction, Request, Response } from "express";
import {
  Error,
  RequestWithLocalVariables,
  ResponseWithLocalVariables,
} from "./definitions";
import express from "express";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import ExpressError from "./utilities/ExpressError";
import User from "./models/mongoose/user";
import collectionRouter from "./routes/collection";
import usersRouter from "./routes/users";
import discoverRouter from "./routes/discover";

const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const dbUrl = process.env.DB_URL;
const app = express();
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  const { statusCode = 500, message = "Something went wrong! :(" } = err;
  res.status(statusCode).send(message);
});
app.use(flash());

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection open!");
  })
  .catch((err: Error) => {
    console.log("oh no!");
    console.log(err);
  });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database connected");
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(
  (
    req: RequestWithLocalVariables,
    res: ResponseWithLocalVariables,
    next: NextFunction
  ) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success")[0];
    res.locals.error = req.flash("error")[0];
    next();
  }
);
app.use("/", usersRouter);
app.use("/collection", collectionRouter);
app.use("/discover", discoverRouter);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ExpressError("Page not found", 404));
});

//error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, Something went wrong!";
  res.status(statusCode).render("./error", { err });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Serving on port ${process.env.PORT || 3000}!`);
});
