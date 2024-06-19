const pieceSchema = joi.object({
    title: joi.string().required(),
    artist: joi.string().required(),
    medium: joi.string().required(),
    year: joi.object({
        year_finished: joi.number.required.min(0),
        year_started: joi.number.min(0)
    }),
    images: joi.string(),
    size: joi.object({
        x: joi.number().min(0),
        y: joi.number().min(0),
        z: joi.number()
    }),
    owner: joi.object({
        name: joi.string(),
        contact_info: joi.string()
    }),
    holder: joi.object({
        name: joi.string(),
        contact_info: joi.string()
    }),
    acquiration_date: joi.date(),
    archival: joi.boolean().required(),
    description: joi.string(),
    user_id: joi.string(),
    forSale: joi.boolean().required(),
    price: joi.number(),
    catalogue: joi.string()
}).required();

const { error } = pieceSchema.validate(req.body);

if (error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
}