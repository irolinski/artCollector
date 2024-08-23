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
exports.discoverPiece = exports.discoverCollection = exports.passCheck = exports.passCheckForm = void 0;
const ArtPiece_1 = __importDefault(require("../models/mongoose/ArtPiece"));
const user_1 = __importDefault(require("../models/mongoose/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const ExpressError_1 = __importDefault(require("../utilities/ExpressError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passCheckForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pageTitle = "Check passcode - artCollector";
    const styleSheet = "forms";
    const username = req.path.split("/")[1];
    res.render("discover_pass_check", { username, pageTitle, styleSheet });
});
exports.passCheckForm = passCheckForm;
const passCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const passCheck = req.body.share_pass_check;
    yield user_1.default.findOne({ username: username }).then((u) => __awaiter(void 0, void 0, void 0, function* () {
        if (u.share_pass !== passCheck) {
            req.flash("error", "Invalid passcode!");
            res.redirect(`/home`);
        }
        else {
            const secret = process.env.JWT_SECRET;
            const payload = {
                username: username,
                id: u._id,
            };
            const id = u._id;
            const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "30m" });
            req.session.discoverToken = token + id;
            req.flash("success", "Have a good time!");
            res.redirect(`/discover/${username}/`);
        }
    }));
});
exports.passCheck = passCheck;
const discoverCollection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const styleSheet = "collection";
    const username = req.path.split("/")[1];
    yield user_1.default.findOne({ username: username }).then((u) => __awaiter(void 0, void 0, void 0, function* () {
        if (!u) {
            req.flash("error", "No such user found...");
            res.redirect("/home");
            return;
        }
        const user = u;
        const id = u._id;
        if (u && u.share_collection === true) {
            if (u.share_pass && !req.session.discoverToken) {
                res.redirect(`/discover/${username}/pass_check`);
                return;
            }
            if (req.session.discoverToken && req.session.discoverToken.includes(id)) {
                let pageTitle;
                if (u.show_name) {
                    pageTitle = `${u.show_name}'s Collection - artCollector`;
                }
                else {
                    pageTitle = `${u.username}'s Collection - artCollector`;
                }
                const artPieces = yield ArtPiece_1.default.find({
                    archival: !{ $in: ["true"] },
                    user_id: `${u._id}`,
                });
                res.render("discover_collection", {
                    artPieces,
                    user,
                    moment: moment_1.default,
                    pageTitle,
                    styleSheet,
                });
            }
            else {
                if (req.session.discoverToken) {
                    req.flash("error", "Sorry, you can browse only one collection at a time... Restart your browser if you wish to browse a different collection!");
                    res.redirect("/home");
                }
                else {
                    if (u.share_pass === "") {
                        const pageTitle = `${u.show_name}'s Collection - artCollector`;
                        const artPieces = yield ArtPiece_1.default.find({
                            archival: !{ $in: ["true"] },
                            user_id: `${u._id}`,
                        });
                        res.render("discover_collection", {
                            artPieces,
                            user,
                            moment: moment_1.default,
                            pageTitle,
                            styleSheet,
                        });
                    }
                    else {
                        req.flash("error", "Wrong passcode, sorry...");
                        res.redirect("/home");
                    }
                }
            }
        }
    }));
});
exports.discoverCollection = discoverCollection;
const discoverPiece = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        req.flash("error", `I'm sorry but I don't think what you're looking for exists in our database!`);
        res.redirect("/campgrounds");
    }
    const p = yield ArtPiece_1.default.findById(id);
    const pageTitle = `${p.title} - artCollector`;
    const styleSheet = "show";
    const origin = req.get("Referrer");
    const owner = yield user_1.default.findById({ _id: p.user_id });
    if (origin &&
        origin.includes("discover") &&
        origin.includes(owner.username)) {
        res.render("discover_piece", {
            p,
            moment: moment_1.default,
            pageTitle,
            styleSheet,
            owner,
        });
    }
    else {
        throw new ExpressError_1.default("Access forbidden", 400);
    }
});
exports.discoverPiece = discoverPiece;
//# sourceMappingURL=discover.js.map