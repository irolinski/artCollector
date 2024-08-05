import { Request, Response } from "express";
import {
  CustomFile,
  Error,
  RequestWithFiles,
  RequestWithLocalVariables,
} from "../definitions";
import { ArtPieceModel } from "../models/definitions";

const moment = require("moment");
const mongoose = require("mongoose");
const { cloudinary } = require("../cloudinary/index");
const fs = require("fs");
const XLSX = require("xlsx");
const ExpressError = require("../utilities/ExpressError");
const ArtPiece = require("../models/artPiece");
const artPieceJOI = require("../models/artPieceJOI");

module.exports.collectionPage = async (
  req: RequestWithLocalVariables,
  res: Response
) => {
  const pageTitle = "My Collection - artCollector";
  const styleSheet = "collection";

  let host = req.get("host");
  const userTable = req.user.custom_table;

  let queryString = JSON.stringify(req.query);

  const archivalStatus = req.query.archival;

  let artPieces = await ArtPiece.find({ user_id: `${req.user._id}` });

  const archivalPieces = await ArtPiece.find({
    archival: { $in: ["true"] },
    user_id: `${req.user._id}`,
  });

  if (archivalStatus === "archival-hide") {
    artPieces = await ArtPiece.find({
      archival: !{ $in: ["true"] },
      user_id: `${req.user._id}`,
    });
  } else if (archivalStatus === "archival-showOnly") {
    artPieces = archivalPieces;
  }

  res.render("collection", {
    artPieces,
    moment: moment,
    archivalStatus,
    queryString,
    userTable,
    pageTitle,
    styleSheet,
    host,
  });
};

module.exports.newPieceForm = (req: Request, res: Response) => {
  const pageTitle = "Add a new piece - artCollector";
  const styleSheet = "forms";

  res.render("new", { pageTitle, styleSheet });
};

module.exports.postNewPiece = async (req: RequestWithFiles, res: Response) => {
  const pieceSchema = artPieceJOI;

  const { error } = pieceSchema.validate(req.body);

  if (error) {
    const msg = error.details
      .map((el: { message: string }) => el.message)
      .join(",");
    throw new ExpressError(msg, 400);
  }

  const newPiece = new ArtPiece(req.body);
  newPiece.images = req.files.map((f: CustomFile) => ({
    url: f.path,
    filename: f.filename,
  }));

  if (req.body.acquiration_date) {
    newPiece.acquiration_date = new Date(`${req.body.acquiration_date}`);
  }

  await newPiece.save();

  req.flash("success", "Successfully added your new piece!");

  res.redirect("collection");
};

module.exports.exportToXlsx = async (
  req: RequestWithLocalVariables,
  res: Response
) => {
  // get date for the filename
  const currentDate = new Date();
  let currentMonth: string = ``;
  const getMonth = currentDate.getMonth() + 1;
  if (getMonth < 10) {
    currentMonth = `0${getMonth}`;
  } else {
    currentMonth = `${getMonth}`;
  }
  const currentYear = `${currentDate.getFullYear()}`;
  const date = currentMonth + "." + currentYear;

  const exportData: ArtPieceModel[] = [];

  for await (let p of ArtPiece.find({ user_id: req.user._id })) {
    const data: ArtPieceModel = {
      title: p.title,
      artist: p.artist,
      medium: p.medium,
      year_started: p.year[0].year_started,
      year_finished: p.year[0].year_finished,
      size_x: p.size[0].x,
      size_y: p.size[0].y,
      size_z: p.size[0].z,
      owner_name:
        p.owner[0].status === "self" ? req.user.show_name : p.owner[0].name,
      owner_contact:
        p.owner[0].status === "self"
          ? req.user.contact_info
          : p.owner[0].contact_info,
      holder_name:
        p.holder[0].status === "self" ? req.user.show_name : p.holder[0].name,
      holder_contact:
        p.holder[0].status === "self"
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

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);
  ws["!ref"] = ws["!ref"].replace("S", "R");

  const file = `public/${req.user.username}-artCollection(${date}).xlsx`;
  XLSX.utils.book_append_sheet(wb, ws, "sheet1");
  XLSX.writeFile(wb, file);

  res.download(file, (err: Error) => {
    if (err) {
      console.log("problem with export " + err);
      res.send("Error occured!");
    }
    fs.unlink(file, () => {
      console.log("export successful");
    });
  });
};

module.exports.showPage = async (
  req: RequestWithLocalVariables,
  res: Response
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash(
      "error",
      `I'm sorry but I don't think what you're looking for exists in our database!`
    );
    res.redirect("/campgrounds");
  }
  const p = await ArtPiece.findById(id);

  const pageTitle = `${p.title} - artCollector`;
  const styleSheet = "show";

  if (JSON.stringify(req.user._id) == `"${p.user_id}"`) {
    res.render("show", { p, moment: moment, pageTitle, styleSheet });
  } else {
    req.flash(
      "error",
      `I'm sorry but I cannot find such piece in your collection`
    );
    res.redirect("/collection");
  }
};

module.exports.editPieceForm = async (req: Request, res: Response) => {
  const pageTitle = "Edit piece - artCollector";
  const styleSheet = "forms";

  const { id } = req.params;
  const p = await ArtPiece.findById(id);
  res.render("edit", { p, moment: moment, pageTitle, styleSheet });
};

module.exports.editImages = async (req: Request, res: Response) => {
  const pageTitle = "Edit images - artCollector";
  const styleSheet = "forms";

  const { id } = req.params;
  const p = await ArtPiece.findById(id);
  res.render("edit_images", { p, pageTitle, styleSheet });
};

module.exports.editPiece = async (req: RequestWithFiles, res: Response) => {
  const { id } = req.params;
  const p = await ArtPiece.findByIdAndUpdate(id, { ...req.body });
  const imgs = req.files.map((f: CustomFile) => ({
    url: f.path,
    filename: f.filename,
  }));
  p.images.push(...imgs);

  if (req.body.makeDefault) {
    for (let imgFileName of req.body.makeDefault) {
      const index = p.images
        .map((image: CustomFile) => image.filename)
        .indexOf(imgFileName);

      let img = p.images[index];
      p.images.splice(index, 1);
      p.images.unshift(img);
    }
  }

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await p.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  await p.save();

  req.flash("success", "Successfully made changes to your piece!");
  res.redirect(`/collection/show/${id}`);
};

module.exports.deletePiece = async (
  req: RequestWithLocalVariables,
  res: Response
) => {
  const { id } = req.params;

  const p = await ArtPiece.findByIdAndDelete(id);

  for (let i of p.images) {
    await cloudinary.uploader.destroy(i.filename);
  }

  req.flash("success", "Successfully deleted your piece!");
  res.redirect("/collection");
};
