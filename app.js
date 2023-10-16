const express = require('express');
const path = require('path');

const ejsMate = require ('ejs-mate');
const moment = require('moment');
const $ = require('jquery');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const joi = require('joi')

const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync');



const app = express();


app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride ('_method'));
app.use(
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
  );

app.use(function (err, req, res, next) {
    const { status = 500, message = 'Something went wrong! :('} = err; 
    res.status(status).send(message);
})

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/artCollection',
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('connection open!')
})
.catch(err => {
    console.log('oh no!')
    console.log(err)
});
const ArtPiece = require('./models/artPiece.js');




app.get('/homepage', (req, res, next) => {
    res.render('homepage')
});

app.get('/collection', catchAsync (async (req, res, next) => {

    let queryString = JSON.stringify(req.query);
    const archivalStatus = req.query.archival;

    let artPieces = await ArtPiece.find({});
    const archivalPieces = await ArtPiece.find({ archival: {$in: [ 'true' ]}});

    if (archivalStatus === 'hide') {
        artPieces = await ArtPiece.find({ archival: !{$in: [ 'true' ]}})
    } if (archivalStatus === 'showOnly') {
        artPieces = archivalPieces
    }

    res.render('collection', { artPieces, moment: moment, archivalStatus, queryString })
}));


app.get('/new', (req, res, next) => {
    res.render('new')
})

app.get


app.post('/collection', catchAsync (async (req, res, next) => {
    console.log(req.body);

    const pieceSchema = joi.object({
        title: joi.string().required(),
        artist: joi.string().required(),
        medium: joi.string().required(),
        year: joi.array().items({

            year_finished: joi.number().min(0).required(),
            year_started: joi.number().min(0).allow('')
    }),
        images: joi.array().items({
            url: joi.string().allow(''),
            filename: joi.string().allow('')
        }),
        size: joi.array().items({
            x: joi.number().min(0),
            y: joi.number().min(0),
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
        acquiration_date: joi.date().raw(),
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
    if (req.body.acquiration_date) { newPiece.acquiration_date = new Date( `${req.body.acquiration_date}` ) }
    console.log(newPiece);
    console.log(req.body);
    await newPiece.save();
    res.redirect('collection')
    }))


app.get('/collection/show/:id', catchAsync (async (req, res, next) => {
    const { id } =  req.params; 
    const p = await ArtPiece.findById(id);
    console.log(p);

    res.render('show', { p, moment: moment})
}))

app.get('/collection/show/:id/edit', catchAsync (async (req, res, next) => {
    const { id } = req.params;
    const p = await ArtPiece.findById(id);
    res.render('edit', { p, moment: moment } )
}))

app.put('/collection/show/:id', catchAsync (async (req, res, next) => {
    const { id } = req.params;
    const p = await ArtPiece.findByIdAndUpdate(id, {...req.body})
    res.redirect(`/collection/show/${id}`);    
}))

app.delete('/collection/show/:id', catchAsync (async (req, res, next) => {
    const { id } = req.params;
    const p = await ArtPiece.findByIdAndDelete(id)
    res.redirect('/collection');
}))


app.all('*', (req, res, next) => {      //*star* means 'for every path'
    next(new ExpressError('Page not found', 404))
})

//error handling middleware yasss
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    // in the line above we destructure any error that is passed to this function
    // and also set a default error
    if (!err.message) err.message = 'Oh no, Something went wrong!'
    res.status(statusCode).render('./error', { err });
    //here, we set a status code to appear in the console and send a message 
})

app.listen(3000, () => {
    console.log('Serving on port 3000!')
});
