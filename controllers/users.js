"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccConfirmed = exports.deleteAcc = exports.resetPassword = exports.sendToken = exports.forgottenPassword = exports.logoutUser = exports.changePassword = exports.editUser = exports.preferences = exports.login = exports.register = exports.home = exports.redirectHome = void 0;
const userCheckUndefined_1 = __importDefault(require("../utilities/userCheckUndefined"));
const sendEmail_1 = __importDefault(require("../utilities/sendEmail"));
const artPiece_1 = __importDefault(require("../models/mongoose/artPiece"));
const user_1 = __importDefault(require("../models/mongoose/user"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
passport_1.default.serializeUser(user_1.default.serializeUser());
passport_1.default.deserializeUser(user_1.default.deserializeUser());
const { cloudinary } = require("../cloudinary/index");
const redirectHome = (req, res, next) => {
    res.redirect("/home");
};
exports.redirectHome = redirectHome;
const home = (req, res, next) => {
    const pageTitle = "Homepage - artCollector";
    const styleSheet = "homepage";
    res.render("homepage", { pageTitle, styleSheet });
};
exports.home = home;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const user = new user_1.default({ email: `${email}`, username: `${username}` });
        const registeredUser = yield user_1.default.register(user, password);
        (0, sendEmail_1.default)(email, "Welcome to artCollector", `Hi,
        Welcome to our site!

        Just wanted to let you know: 
        if you're having any problems or want to provide info on any bugs: reach us under artcollector.messages@gmail.com.

        This should be the first and the last automatic message you'll ever get from us.

        We wish you all the best, 
        artCollector team
      `);
        req.login(registeredUser, (err) => {
            if (err)
                return next(err);
            req.flash("success", "Welcome!");
            res.redirect("/collection");
        });
    }
    catch (err) {
        req.flash("error", `${err.message}. Try again, please!`);
        res.redirect("/home");
    }
});
exports.register = register;
const login = (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/collection");
};
exports.login = login;
const preferences = (req, res, next) => {
    const pageTitle = "Preferences - artCollector";
    const styleSheet = "forms";
    res.render("preferences", { pageTitle, styleSheet });
};
exports.preferences = preferences;
const editUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, userCheckUndefined_1.default)(req);
    if (req.body.custom_table) {
        yield user_1.default.findOneAndUpdate(req.user._id, {
            custom_table: req.body.custom_table,
        });
    }
    else {
        yield user_1.default.findOneAndUpdate(req.user._id, {
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
    }
    else {
        req.flash("success", "Your changes have been saved!");
    }
    res.redirect("/collection");
});
exports.editUser = editUser;
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, userCheckUndefined_1.default)(req);
    user_1.default.findOne({ username: req.user.username }).then((u) => {
        u.setPassword(req.body.new_password, (err, u) => {
            if (err)
                return next(err);
            u.save();
            res.status(200).json({ message: "password change successful" });
        });
        req.flash("success", "Your password has been changed. Next time you log in, use your new password!");
        res.redirect("/collection");
    });
});
exports.changePassword = changePassword;
const logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/home");
    });
};
exports.logoutUser = logoutUser;
const forgottenPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const origin = req.headers.origin;
    yield user_1.default.findOne({ email: email }).then((u) => {
        if (u) {
            const secret = process.env.JWT_SECRET + u.password;
            const payload = {
                email: u.email,
                id: u._id,
            };
            const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "15m" });
            const link = `${origin}/password_reset/${u._id}/${token}`;
            (0, sendEmail_1.default)(u.email, "Password Reset", `Hi,

            It seems that you have requested a password reset. 
            If you want to proceed: click the link below and follow the instructions. 
            The link will be available for 15 minutes only. 

            ${link}

            Take care, 
            artCollector team
          `);
            req.flash("success", "An email with furhter instructions has been sent to the provided adress.");
            res.redirect("/home");
        }
        else {
            req.flash("error", "Invalid e-mail adress. Try again!");
            res.redirect("/home");
        }
    });
});
exports.forgottenPassword = forgottenPassword;
const sendToken = (req, res, next) => {
    const { id, token } = req.params;
    user_1.default.findById(id).then((u) => {
        if (u) {
            if (!u) {
                req.flash("error", "Invalid id!");
                res.redirect("/home");
            }
            else {
                const secret = process.env.JWT_SECRET + u.password;
                try {
                    const payload = jsonwebtoken_1.default.verify(token, secret);
                    res.render("password_reset", {
                        email: u.email,
                        pageTitle: "Password reset - artCollector",
                        styleSheet: "forms",
                    });
                }
                catch (error) {
                    res.send(error.message);
                }
            }
        }
        else {
            req.flash("error", "We encountered a mistake: no such user id. Please, try again.");
            res.redirect("/home");
        }
    });
};
exports.sendToken = sendToken;
const resetPassword = (req, res, next) => {
    const { id, token } = req.params;
    user_1.default.findById(id).then((u) => {
        u.setPassword(req.body.new_password, (err, u) => {
            if (err)
                return next(err);
            u.save();
            res.status(200).json({ message: "password change successful" });
        });
        req.flash("success", "Your password has been changed. Next time you log in, use your new password!");
        res.redirect("/home");
    });
};
exports.resetPassword = resetPassword;
const deleteAcc = (req, res, next) => {
    const pageTitle = "Delete account - art Collector";
    const styleSheet = "forms";
    res.render("preferences_deleteAcc", { pageTitle, styleSheet });
};
exports.deleteAcc = deleteAcc;
const deleteAccConfirmed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, userCheckUndefined_1.default)(req);
    const pieces = yield artPiece_1.default.find({ user_id: req.user._id });
    for (let p of pieces) {
        for (let img of p.images) {
            yield cloudinary.uploader.destroy(img.filename);
        }
    }
    yield artPiece_1.default.deleteMany({ user_id: req.user._id });
    yield user_1.default.findByIdAndDelete(req.user._id);
    req.flash("success", "Goodbye :(");
    res.redirect("/home");
});
exports.deleteAccConfirmed = deleteAccConfirmed;
//# sourceMappingURL=users.js.map