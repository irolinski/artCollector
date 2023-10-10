const express = require('express');
const path = require('path');

const ejsMate = require ('ejs-mate');
const moment = require('moment');
const $ = require('jquery');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride ('_method'));

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

app.use(
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
  );




app.get('/homepage', (req, res) => {
    res.render('homepage')
});

app.get('/collection', async (req, res) => {

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
});


app.get('/new', (req, res) => {
    res.render('new')
})

app.get


app.post('/collection', async (req, res) => {
    const newPiece = new ArtPiece(req.body);
    if (req.body.acquiration_date) { newPiece.acquiration_date = new Date( `${req.body.acquiration_date}` ) }
    console.log(newPiece);
    console.log(req.body);
    await newPiece.save();
    res.redirect('collection')
    })


app.get('/collection/show/:id', async (req, res) => {
    const { id } =  req.params; 
    const p = await ArtPiece.findById(id);
    res.render('show', { p, moment: moment})
})

app.get('/collection/show/:id/edit', async (req, res) => {
    const { id } = req.params;
    const p = await ArtPiece.findById(id);
    res.render('edit', { p, moment: moment } )
})

app.put('/collection/show/:id', async (req, res) => {
    const { id } = req.params;
    const p = await ArtPiece.findByIdAndUpdate(id, {...req.body})
    console.log(req.body);
    res.redirect(`/collection/show/${id}`);    
})



app.listen(3000, () => {
    console.log('Serving on port 3000!')
});
