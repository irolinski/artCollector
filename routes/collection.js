
const express = require('express');
const router = express.Router();

const moment = require('moment');
const joi = require('joi');

const mongoose = require('mongoose');

const multer = require('multer');
const {storage} = require('../cloudinary/index.js');
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 5000000,
        files: 1,
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
      }
     
}); 
const { cloudinary } = require('../cloudinary');

const fs = require('fs');
const XLSX = require('xlsx');

const ExpressError = require('../utilities/ExpressError');
const isLoggedIn  = require('../utilities/isLoggedIn')
const catchAsync = require('../utilities/catchAsync');

const ArtPiece = require('../models/artPiece.js');





router.get('/', isLoggedIn, catchAsync (async (req, res, next) => {


    let queryString = JSON.stringify(req.query);
    const userTable = (req.user.custom_table);

    const archivalStatus = req.query.archival;
    

    let artPieces = await ArtPiece.find({user_id: `${req.user._id}`}); 
    
    const archivalPieces = await ArtPiece.find(
        { archival: {$in: [ 'true' ]},
        user_id: `${req.user._id}`
    });

    if (archivalStatus === 'archival-hide') {
        artPieces = await ArtPiece.find(
            { archival: !{$in: [ 'true' ]},
            user_id: `${req.user._id}`
        });

    } if (archivalStatus === 'archival-showOnly') {
        artPieces = archivalPieces
    }



    res.render('collection', { artPieces, moment: moment, archivalStatus, queryString, userTable })
}));


router.get('/new', isLoggedIn, (req, res, next) => {

    res.render('new')
})



router.post('/', isLoggedIn, upload.array('images'), catchAsync (async (req, res, next) => {



    const pieceSchema = joi.object({
        title: joi.string().required(),
        artist: joi.string().required(),
        medium: joi.string().required(),
        year: joi.array().items({

            year_finished: joi.number().min(0).allow(''), // I'd prefer it required...
            year_started: joi.number().min(0).allow('')
    }),
        images: joi.array().items({
            url: joi.string().allow(''),
            filename: joi.string().allow('')
        }),
        size: joi.array().items({
            x: joi.number().min(0).allow(''),
            y: joi.number().min(0).allow(''),
            z: joi.number().min(0).allow(''),
            unit: joi.string().required()
        }),
        owner: joi.array().items({
            name: joi.string().allow(''),
            contact_info: joi.string().allow(''),
            status: joi.string()
        }),
        holder: joi.array().items({
            name: joi.string().allow(''),
            contact_info: joi.string().allow(''),
            status: joi.string()
        }),
        acquiration_date: joi.date().raw().allow(''),
        archival: joi.boolean().falsy('0').truthy('1').required(),
        description: joi.string().allow(''),
        user_id: joi.string().allow(''),
        forSale: joi.boolean().required().falsy('0').truthy('1').required(),
        price: joi.array().items({
            price: joi.number().allow('').min(0),
            currency: joi.string()
        }),

        catalogue: joi.string().allow('')
    }).required();
    
    const { error } = pieceSchema.validate(req.body);

    
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }


    
    const newPiece = new ArtPiece(req.body);
    newPiece.images = req.files.map(f => ({url: f.path, filename: f.filename }))

    if (req.body.acquiration_date) { newPiece.acquiration_date = new Date( `${req.body.acquiration_date}` ) }

    await newPiece.save();

    req.flash('success', 'Successfully added your new piece!');

    res.redirect('collection')


    }))

    router.post('/export_collection', isLoggedIn, catchAsync (async (req, res, next) => {
    
        let currentDate = new Date()
        currentDate = `${currentDate.getMonth()}.${currentDate.getFullYear()}`;


        let exportData = []


        for await (let p of ArtPiece.find({ user_id: req.user._id })) {

            let data = ({
                title: p.title,
                artist: p.artist,
                medium: p.medium,
                year_started: p.year[0].year_started,
                year_finished: p.year[0].year_finished,
                size_x:  p.size[0].x,
                size_y:  p.size[0].y,
                size_z:  p.size[0].z,
                image_url: p.images[0].url,
                owner_name: (p.owner[0].status === 'self') ? req.user.show_name : p.owner[0].name,
                owner_contact: (p.owner[0].status === 'self') ? req.user.contact_info : p.owner[0].contact_info,
                holder_name:(p.holder[0].status === 'self') ? req.user.show_name : p.holder[0].name,
                holder_contact: (p.holder[0].status === 'self') ? req.user.contact_info : p.holder[0].contact_info,
                forSale: p.forSale,
                price: p.price[0].price,
                price_currency: p.price[0].currency,
                archival: p.archival,
                description: p.description,
                catalogue_number: p.catalogue,
            })
            exportData.unshift(data);
        }
       const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        ws['!ref'] = ws['!ref'].replace('S','R'); 

        const file = `public/${req.user.username}-artCollection(${currentDate}).xlsx`
        XLSX.utils.book_append_sheet(wb,ws,'sheet1');
        XLSX.writeFile(wb, file);

        res.download(file, (err) => {
            if (err) {
              console.log('problem with export ' + err)
            }
            fs.unlink(file, () => {
                console.log('export successful')
            })});

            }));
    
    
    
    




router.get('/show/:id',isLoggedIn, catchAsync (async (req, res, next) => {

    //need to add here a function that checks if currentUser is the author of the piece

    const { id } =  req.params; 
    if( !mongoose.Types.ObjectId.isValid(id) ){
        req.flash('error', `I'm sorry but I don't think what you're looking for exists in our database!`);
        res.redirect('/campgrounds');
    }
    const p = await ArtPiece.findById(id);
    console.log(JSON.stringify(req.user._id), 'aaaand' , p.user_id);

    if ( JSON.stringify(req.user._id) == p.user_id) {

    res.render('show', { p, moment: moment})
    } else {
        req.flash('error', `I'm sorry but I cannot find such piece in your collection`);
        res.redirect('/collection')
    }
}))

router.get('/show/:id/edit', isLoggedIn, catchAsync (async (req, res, next) => {
    const { id } = req.params;
    const p = await ArtPiece.findById(id);
    res.render('edit', { p, moment: moment } )
}))

router.get('/show/:id/edit/images', isLoggedIn, catchAsync (async (req, res, next) => {
    const { id } = req.params;
    const p = await ArtPiece.findById(id);
    res.render('edit_images', { p } )
}))

router.put('/show/:id', isLoggedIn, upload.array('images'), catchAsync (async (req, res, next) => {
    const { id } = req.params;

    const p = await ArtPiece.findByIdAndUpdate(id, {...req.body});
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    p.images.push(...imgs);

    if (req.body.makeDefault){
        
        for (let imgFileName of req.body.makeDefault) {
         

            const index = p.images.map((image) => image.filename).indexOf(imgFileName)

            let img = p.images[index] 
            p.images.splice(index, 1)
            p.images.unshift(img)
       
    }}

    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await  p.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages } } } });
       }



    await p.save();



    req.flash('success', 'Successfully made changes to your piece!');
    res.redirect(`/collection/show/${id}`);    
}))

router.delete('/show/:id', isLoggedIn, catchAsync (async (req, res, next) => {
    const { id } = req.params;

    const p = await ArtPiece.findByIdAndDelete(id);

    for (let i of p.images){
        await cloudinary.uploader.destroy(i.filename);
    }
    
    

    
    req.flash('success', 'Successfully deleted your piece!');

    res.redirect('/collection');
}))





module.exports = router;