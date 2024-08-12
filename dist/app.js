"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const dbUrl = process.env.DB_URL;
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utilities/ExpressError");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));
app.use(function (err, req, res, next) {
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
    .catch((err) => {
    console.log("oh no!");
    console.log(err);
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("database connected");
});
const User = require("./models/mongoose/user");
const collectionRouter = require("./routes/collection");
const usersRouter = require("./routes/users");
const discoverRouter = require("./routes/discover");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.use("/", usersRouter);
app.use("/collection", collectionRouter);
app.use("/discover", discoverRouter);
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message)
        err.message = "Oh no, Something went wrong!";
    res.status(statusCode).render("./error", { err });
});
app.listen(process.env.PORT || 3000, () => {
    console.log("Serving!");
});
//# sourceMappingURL=app.js.map