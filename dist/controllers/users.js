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
Object.defineProperty(exports, "__esModule", { value: true });
const ArtPiece = require("../models/mongoose/artPiece");
const User = require("../models/mongoose/user");
const passport = require("passport");
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_KEY,
    },
});
function sendEmail(userEmail, subject, emailBody) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield transporter
            .sendMail({
            from: `"artCollector Team" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: subject,
            text: emailBody,
        })
            .catch(console.error);
        return info ? info.messageID : null;
    });
}
const { cloudinary } = require("../cloudinary/index");
module.exports.redirectHome = (req, res, next) => {
    res.redirect("/home");
};
module.exports.home = (req, res, next) => {
    const pageTitle = "Homepage - artCollector";
    const styleSheet = "homepage";
    res.render("homepage", { pageTitle, styleSheet });
};
module.exports.register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email: `${email}`, username: `${username}` });
        const registeredUser = yield User.register(user, password);
        sendEmail(email, "Welcome to artCollector", `Hi,
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
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/collection");
};
module.exports.preferences = (req, res, next) => {
    const pageTitle = "Preferences - artCollector";
    const styleSheet = "forms";
    res.render("preferences", { pageTitle, styleSheet });
};
module.exports.editUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.custom_table) {
        yield User.findOneAndUpdate(req.user._id, {
            custom_table: req.body.custom_table,
        });
    }
    else {
        yield User.findOneAndUpdate(req.user._id, {
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
module.exports.changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    User.findOne({ username: req.user.username }).then((u) => {
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
module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/home");
    });
};
module.exports.forgottenPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const origin = req.headers.origin;
    yield User.findOne({ email: email }).then((u) => {
        if (u) {
            const secret = process.env.JWT_SECRET + u.password;
            const payload = {
                email: u.email,
                id: u._id,
            };
            const token = JWT.sign(payload, secret, { expiresIn: "15m" });
            const link = `${origin}/password_reset/${u._id}/${token}`;
            sendEmail(u.email, "Password Reset", `Hi,

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
module.exports.sendToken = (req, res, next) => {
    const { id, token } = req.params;
    User.findById(id).then((u) => {
        if (u) {
            if (!u) {
                req.flash("error", "Invalid id!");
                res.redirect("/home");
            }
            else {
                const secret = process.env.JWT_SECRET + u.password;
                try {
                    const payload = JWT.verify(token, secret);
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
module.exports.resetPassword = (req, res, next) => {
    const { id, token } = req.params;
    User.findById(id).then((u) => {
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
module.exports.deleteAcc = (req, res, next) => {
    const pageTitle = "Delete account - art Collector";
    const styleSheet = "forms";
    res.render("preferences_deleteAcc", { pageTitle, styleSheet });
};
module.exports.deleteAccConfirmed = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pieces = yield ArtPiece.find({ user_id: req.user._id });
    for (let p of pieces) {
        for (let img of p.images) {
            yield cloudinary.uploader.destroy(img.filename);
        }
    }
    yield ArtPiece.deleteMany({ user_id: req.user._id });
    yield User.findByIdAndDelete(req.user._id);
    req.flash("success", "Goodbye :(");
    res.redirect("/home");
});
//# sourceMappingURL=users.js.map