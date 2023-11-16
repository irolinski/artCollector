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

const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_KEY
    }
});

async function sendEmail(userEmail, subject, emailBody) {
    const info = await transporter.sendMail({
        from: `"artCollector Team" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: subject,
        text: emailBody,
    }).catch(console.error);
    return info ? info.messageID : null; 
}

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










router.get('/register', (req, res, next) => {
    res.render('register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = new User ({ email: `${email}`, username: `${username}`});
        const registeredUser = await User.register(user, password);

        sendEmail(email, 'Welcome to artCollector', 
        `Hi,
        Welcome to our site!

        Just wanted to let you know: 
        if you're having any problems or want to provide info on any bugs: use this e-mail adress.

        This should be the first and the last automatic message you'll ever get from us.

        We wish you all the best, 
        artCollector team
      `)

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome!');
            res.redirect('/collection');
        }
        )

    } catch(err){
        req.flash('error', err.message,'.', 'Try again, please!');
        res.redirect('/home');
    }
}))

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/home' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/collection');
})

router.get('/preferences', isLoggedIn, (req, res, next) => {
    console.log(req.user);
    res.render('preferences');
})

router.put('/preferences/edit', isLoggedIn, catchAsync (async (req, res, next) => {

    console.log(req.body.custom_table)

    if (req.body.custom_table){
        await User.findOneAndUpdate(req.user._id, {
            custom_table: req.body.custom_table
        })
    } else {
        await User.findOneAndUpdate(req.user._id, { 
            username: req.body.username,
            email: req.body.email,
            show_name: req.body.show_name,
            contact_info: req.body.contact_info,
    })};
    req.flash('success', 'Your changes have been saved!');
    res.redirect('/collection')
        
}))

router.put('/preferences/change_password', isLoggedIn, catchAsync (async (req, res, next) => {
    User.findOne({ username: req.user.username })
    .then((u) => {
        (u.setPassword(req.body.new_password,(err, u) => {
            if (err) return next(err);
            u.save();
            res.status(200).json({ message: 'password change successful' });
        }));
        req.flash('success', 'Your password has been changed. Next time you log in, use your new password!');
        res.redirect('/collection')
    })
}))
    



router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/home')
    })
})


router.post('/forgotten', catchAsync(async (req, res, next) => {
    
    const { email } = req.body;
    const origin = req.headers.origin;

    
    await User.findOne({ email: email })
    .then((u) => {
        if(u){
            const secret = process.env.JWT_SECRET + u.password
            const payload = {
                email: u.email,
                id: u._id
            }
            const token = JWT.sign(payload, secret, {expiresIn: '15m'})
            const link = `${origin}/password_reset/${u._id}/${token}`
            sendEmail(u.email, 'Password Reset', 
            `Hi,

            It seems that you have requested a password reset. 
            If you want to proceed: click the link below and follow the instructions. 
            The link will be available for 15 minutes only. 

            ${link}

            Take care, 
            artCollector team
          `)
            req.flash('success', 'An email with furhter instructions has been sent to the provided adress.')
            res.redirect('/home')
            
        } else {
            req.flash('error', 'Invalid e-mail adress. Try again!')
            res.redirect('/home')
        }

    })
}));


router.get('/password_reset/:id/:token', (req, res, next) => {

    const { id, token } = req.params

    User.findById(id)
    .then((u) => {
        if (u) {
        console.log(u)
        if (!u) {
            req.flash('Invalid id!')
            res.redirect('/home')
        } else {
            const secret = process.env.JWT_SECRET + u.password;
            try {
                const payload = JWT.verify(token, secret)
                res.render('password_reset',  { email: u.email })
            } catch(error) {
                res.send(error.message);
            }
        }
    } else {
        req.flash('error', 'We encountered a mistake: no such user id. Please, try again.')
        res.redirect('/home')
    }
})

});

router.post('/password_reset/:id/:token', (req, res, next) => {
    console.log('yes, im changing' )

    const { id, token } = req.params
    User.findById(id)
        .then((u) => {
            (u.setPassword(req.body.new_password,(err, u) => {
                if (err) return next(err);
                u.save();
                res.status(200).json({ message: 'password change successful' });
            }));
            req.flash('success', 'Your password has been changed. Next time you log in, use your new password!');
            res.redirect('/home')
        })
});

router.get('/preferences/deleteAcc', isLoggedIn, (req, res, next) => {
    res.render('preferences_deleteAcc')
});


router.delete('/preferences/deleteAcc/confirmed', passport.authenticate('local', { failureFlash: true, failureRedirect: '/preferences' }), isLoggedIn, catchAsync(async (req, res, next) => {

console.log('authentication success')


    const pieces = await ArtPiece.find({ user_id: req.user._id } );

   for (let p of pieces) {
        for (let img of p.images){
                await cloudinary.uploader.destroy(img.filename)
        }};

   await ArtPiece.deleteMany({ user_id: req.user._id });

    await User.findByIdAndDelete(req.user._id);

    req.flash('success', 'Goodbye :(');
   
    res.redirect('/home');


    }));


module.exports = router;