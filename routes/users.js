const express = require('express');
const router = express.Router();

const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');
const isLoggedIn  = require('../utilities/isLoggedIn')

const ArtPiece = require('../models/artPiece.js');
const User = require('../models/user.js');

const passport = require('passport');
const LocalStrategy = require('passport-local');
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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

const users = require('../controllers/users.js');


router.get('/', users.redirectHome)

router.get('/home', users.home);

router.post('/register', users.register);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/home' }), users.login);

router.get('/preferences', isLoggedIn, users.preferences);

router.put('/preferences/edit', isLoggedIn, catchAsync (users.editUser));

router.put('/preferences/change_password', isLoggedIn, catchAsync(users.changePassword));
    
router.get('/logout', users.logoutUser)


router.post('/forgotten', catchAsync(users.forgottenPassword));

router.route('/password_reset/:id/:token')
    .get(users.sendToken)
    .post(users.resetPassword);

router.route('/preferences/deleteAcc')
    .get(isLoggedIn, users.deleteAcc)
    .delete( passport.authenticate('local', { failureFlash: true, failureRedirect: '/preferences' }), isLoggedIn, catchAsync(users.deleteAccConfirmed));



module.exports = router;