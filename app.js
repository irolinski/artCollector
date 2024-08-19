"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const passport_1 = __importDefault(require("passport"));
const ExpressError_1 = __importDefault(require("./utilities/ExpressError"));
const user_1 = __importDefault(require("./models/mongoose/user"));
const collection_1 = __importDefault(require("./routes/collection"));
const users_1 = __importDefault(require("./routes/users"));
const discover_1 = __importDefault(require("./routes/discover"));
const LocalStrategy = require("passport-local");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const app = (0, express_1.default)();
app.set("views", path_1.default.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use("/public", express_1.default.static("public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express_1.default.static(path_1.default.join(__dirname, "node_modules/bootstrap/dist/")));
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong! :(" } = err;
    res.status(statusCode).send(message);
});
app.use((0, connect_flash_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.use(new LocalStrategy(user_1.default.authenticate()));
passport_1.default.serializeUser(user_1.default.serializeUser());
passport_1.default.deserializeUser(user_1.default.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success")[0];
    res.locals.error = req.flash("error")[0];
    next();
});
app.get("/server-check", (req, res) => {
    res.status(200).json({ message: "running" });
});
app.use("/", users_1.default);
app.use("/collection", collection_1.default);
app.use("/discover", discover_1.default);
app.all("*", (req, res, next) => {
    next(new ExpressError_1.default("Page not found", 404));
});
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message)
        err.message = "Oh no, Something went wrong!";
    res.status(statusCode).render("./error", { err });
});
exports.default = app;
//# sourceMappingURL=app.js.map