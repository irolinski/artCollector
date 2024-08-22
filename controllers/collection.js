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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePiece = exports.editPiece = exports.editImages = exports.editPieceForm = exports.showPage = exports.exportToXlsx = exports.postNewPiece = exports.newPieceForm = exports.collectionPage = void 0;
const userCheckUndefined_1 = __importDefault(require("../utilities/userCheckUndefined"));
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const xlsx_1 = __importDefault(require("xlsx"));
const ExpressError_1 = __importDefault(require("../utilities/ExpressError"));
const ArtPiece_1 = __importDefault(require("../models/mongoose/ArtPiece"));
const artPieceJOI_1 = __importDefault(require("../models/mongoose/artPieceJOI"));
const index_1 = require("../cloudinary/index");
const collectionPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageTitle = "My Collection - artCollector";
    const styleSheet = "collection";
    const host = req.get("host");
    (0, userCheckUndefined_1.default)(req);
    const userTable = req.user.custom_table;
    const queryString = JSON.stringify(req.query);
    const archivalStatus = req.query.archival;
    let artPieces = yield ArtPiece_1.default.find({ user_id: `${req.user._id}` });
    const archivalPieces = yield ArtPiece_1.default.find({
        archival: { $in: ["true"] },
        user_id: `${req.user._id}`,
    });
    if (archivalStatus === "archival-hide") {
        artPieces = yield ArtPiece_1.default.find({
            archival: !{ $in: ["true"] },
            user_id: `${req.user._id}`,
        });
    }
    else if (archivalStatus === "archival-showOnly") {
        artPieces = archivalPieces;
    }
    res.render("collection", {
        artPieces,
        moment: moment_1.default,
        archivalStatus,
        queryString,
        userTable,
        pageTitle,
        styleSheet,
        host,
    });
});
exports.collectionPage = collectionPage;
const newPieceForm = (req, res) => {
    const pageTitle = "Add a new piece - artCollector";
    const styleSheet = "forms";
    res.render("new", { pageTitle, styleSheet });
};
exports.newPieceForm = newPieceForm;
const postNewPiece = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pieceSchema = artPieceJOI_1.default;
    const { error } = pieceSchema.validate(req.body);
    if (error) {
        const msg = error.details
            .map((el) => el.message)
            .join(",");
        throw new ExpressError_1.default(msg, 400);
    }
    const newPiece = new ArtPiece_1.default(req.body);
    newPiece.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    if (req.body.acquiration_date) {
        newPiece.acquiration_date = new Date(`${req.body.acquiration_date}`);
    }
    res.statusCode = 200;
    yield newPiece.save();
    req.flash("success", "Successfully added your new piece!");
    res.redirect("collection");
});
exports.postNewPiece = postNewPiece;
const exportToXlsx = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    (0, userCheckUndefined_1.default)(req);
    const currentDate = new Date();
    let currentMonth = ``;
    const getMonth = currentDate.getMonth() + 1;
    if (getMonth < 10) {
        currentMonth = `0${getMonth}`;
    }
    else {
        currentMonth = `${getMonth}`;
    }
    const currentYear = `${currentDate.getFullYear()}`;
    const date = currentMonth + "." + currentYear;
    const exportData = [];
    try {
        for (var _d = true, _e = __asyncValues(ArtPiece_1.default.find({ user_id: req.user._id })), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            let p = _c;
            const data = {
                title: p.title,
                artist: p.artist,
                medium: p.medium,
                year_started: p.year[0].year_started,
                year_finished: p.year[0].year_finished,
                size_x: p.size[0].x,
                size_y: p.size[0].y,
                size_z: p.size[0].z,
                owner_name: p.owner[0].status === "self" ? req.user.show_name : p.owner[0].name,
                owner_contact: p.owner[0].status === "self"
                    ? req.user.contact_info
                    : p.owner[0].contact_info,
                holder_name: p.holder[0].status === "self" ? req.user.show_name : p.holder[0].name,
                holder_contact: p.holder[0].status === "self"
                    ? req.user.contact_info
                    : p.holder[0].contact_info,
                forSale: p.forSale,
                price: p.price[0].price,
                price_currency: p.price[0].currency,
                archival: p.archival,
                description: p.description,
                catalogue_number: p.catalogue,
                acquisition_date: p.acquiration_date,
                image_url_1: p.images[0] !== undefined ? p.images[0].url : null,
                image_url_2: p.images[1] !== undefined ? p.images[1].url : null,
                image_url_3: p.images[2] !== undefined ? p.images[2].url : null,
                image_url_4: p.images[3] !== undefined ? p.images[3].url : null,
            };
            exportData.unshift(data);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    const wb = xlsx_1.default.utils.book_new();
    const ws = xlsx_1.default.utils.json_to_sheet(exportData);
    ws["!ref"] = ws["!ref"].replace("S", "R");
    const file = `public/${req.user.username}-artCollection(${date}).xlsx`;
    xlsx_1.default.utils.book_append_sheet(wb, ws, "sheet1");
    xlsx_1.default.writeFile(wb, file);
    res.download(file, (err) => {
        if (err) {
            res.send("Error occured!");
        }
        fs_1.default.unlink(file, () => {
        });
    });
});
exports.exportToXlsx = exportToXlsx;
const showPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        req.flash("error", `I'm sorry but I don't think what you're looking for exists in our database!`);
        res.redirect("/campgrounds");
    }
    const p = yield ArtPiece_1.default.findById(id);
    const pageTitle = `${p.title} - artCollector`;
    const styleSheet = "show";
    (0, userCheckUndefined_1.default)(req);
    if (JSON.stringify(req.user._id) == `"${p.user_id}"`) {
        res.render("show", { p, moment: moment_1.default, pageTitle, styleSheet });
    }
    else {
        req.flash("error", `I'm sorry but I cannot find such piece in your collection`);
        res.redirect("/collection");
    }
});
exports.showPage = showPage;
const editPieceForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageTitle = "Edit piece - artCollector";
    const styleSheet = "forms";
    const { id } = req.params;
    const p = yield ArtPiece_1.default.findById(id);
    res.render("edit", { p, moment: moment_1.default, pageTitle, styleSheet });
});
exports.editPieceForm = editPieceForm;
const editImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageTitle = "Edit images - artCollector";
    const styleSheet = "forms";
    const { id } = req.params;
    const p = yield ArtPiece_1.default.findById(id);
    res.render("edit_images", { p, pageTitle, styleSheet });
});
exports.editImages = editImages;
const editPiece = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const p = yield ArtPiece_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
    const imgs = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    p.images.push(...imgs);
    if (req.body.makeDefault) {
        for (let imgFileName of req.body.makeDefault) {
            const index = p.images
                .map((image) => image.filename)
                .indexOf(imgFileName);
            let img = p.images[index];
            p.images.splice(index, 1);
            p.images.unshift(img);
        }
    }
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            yield index_1.cloudinary.uploader.destroy(filename);
        }
        yield p.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    yield p.save();
    req.flash("success", "Successfully made changes to your piece!");
    res.redirect(`/collection/show/${id}`);
});
exports.editPiece = editPiece;
const deletePiece = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const p = yield ArtPiece_1.default.findByIdAndDelete(id);
    for (let i of p.images) {
        yield index_1.cloudinary.uploader.destroy(i.filename);
    }
    req.flash("success", "Successfully deleted your piece!");
    res.redirect("/collection");
});
exports.deletePiece = deletePiece;
//# sourceMappingURL=collection.js.map