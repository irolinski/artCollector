if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const dbUrl = process.env.DB_URL;


const express = require('express');
const path = require('path');

const ejsMate = require ('ejs-mate');
const $ = require('jquery');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const mongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const ExpressError = require('./utilities/ExpressError');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');


app.use(session({secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true}));


app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride ('_method'));
app.use(
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
  );

app.use(function (err, req, res, next) {
    const { status = 500, message = 'Something went wrong! :('} = err; 
    res.status(status).send(message);
})


app.use(flash());

const mongoose = require('mongoose');
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,})
.then(() => {
    console.log('connection open!')
})
.catch(err => {
    console.log('oh no!')
    console.log(err)
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('database connected');
})


const User = require('./models/user.js');

const collectionRouter = require('./routes/collection')
const usersRouter = require('./routes/users')

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {

    res.locals.currentUser = req.user;

    res.locals.success = req.flash('success');
 //this middleware is here so that on every single request, we're going to take whatever is in locals under 'succes' and have access to it
 // so we don't have to pass through msg.flash("success") everytime
     res.locals.error = req.flash('error');
 //res.locals makes it so that we don't have to pass it through and it's available to every page
 next();
 })
 




app.use('/', usersRouter)
app.use('/collection', collectionRouter)


app.all('*', (req, res, next) => {      //*star* means 'for every path'
    next(new ExpressError('Page not found', 404))
})

//error handling middleware 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    // in the line above we destructure any error that is passed to this function
    // and also set a default error
    if (!err.message) err.message = 'Oh no, Something went wrong!'
    res.status(statusCode).render('./error', { err });
    //here, we set a status code to appear in the console and send a message 
})

app.listen(process.env.PORT || 3000 , () => {
    console.log('Serving!')
});

