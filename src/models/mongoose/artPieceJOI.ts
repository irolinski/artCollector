const joi = require("joi");

const pieceSchema = joi
  .object({
    title: joi.string().required(),
    artist: joi.string().required(),
    medium: joi.string().required(),
    year: joi.array().items({
      year_finished: joi.number().min(0).allow(""),
      year_started: joi.number().min(0).allow(""),
    }),
    images: joi.array().items({
      url: joi.string().allow(""),
      filename: joi.string().allow(""),
    }),
    size: joi.array().items({
      x: joi.number().min(0).allow(""),
      y: joi.number().min(0).allow(""),
      z: joi.number().min(0).allow(""),
      unit: joi.string().allow(""),
    }),
    owner: joi.array().items({
      name: joi.string().allow(""),
      contact_info: joi.string().allow(""),
      status: joi.string(),
    }),
    holder: joi.array().items({
      name: joi.string().allow(""),
      contact_info: joi.string().allow(""),
      status: joi.string(),
    }),
    acquiration_date: joi.date().raw().allow(""),
    archival: joi.boolean().falsy("0").truthy("1").required(),
    description: joi.string().allow(""),
    user_id: joi.string().allow(""),
    forSale: joi.boolean().required().falsy("0").truthy("1").required(),
    price: joi.array().items({
      price: joi.number().allow("").min(0),
      currency: joi.string(),
    }),

    catalogue: joi.string().allow(""),
  })
  .required();

export default pieceSchema;
