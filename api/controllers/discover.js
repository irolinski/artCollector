const express = require('express');
const router = express.Router();


const ArtPiece = require('../models/artPiece.js');
const User = require('../models/user.js');

const mongoose = require('mongoose');
const moment = require('moment');


const ExpressError = require('../utilities/ExpressError');

const JWT = require('jsonwebtoken');


module.exports.passCheckForm = async (req, res, next) => {
    const pageTitle = 'Check passcode - artCollector'
    const styleSheet = 'forms'
    let username = req.path.split('/')[1];

    res.render('discover_pass_check', { username, pageTitle, styleSheet })
}

module.exports.passCheck = async (req, res, next) => {

    let username = req.body.username;
    let passCheck = req.body.share_pass_check

    await User.findOne({ username: username }).then( async (u) => {
  
        if (u.share_pass !== passCheck){
            req.flash('error', 'Invalid passcode!')
            res.redirect(`/home`)

        } else {

            const secret = process.env.JWT_SECRET // + passCheck
            const payload = {
                username: username,
                id: u._id
            }

            let id = u._id;

            const token = JWT.sign(payload, secret, {expiresIn: '30m'})
            req.session.discoverToken = token + id

            req.flash('success', 'Have a good time!')
            res.redirect(`/discover/${username}/`)
        }
    })

}


module.exports.discoverCollection = async (req, res, next) => {

    const styleSheet = 'collection'
    

    let username = req.path.split('/')[1];
    

    await User.findOne({ username: username }).then( async (u) => {

        if(!u){
            req.flash('error', 'No such user found...') 
            res.redirect('/home')
            return;
        }

        let user = u;
        let id = u._id

        if(u && u.share_collection === true){ 

            if (u.share_pass && !req.session.discoverToken) {

                res.redirect(`/discover/${username}/pass_check`)
                return;
            } 
            if (req.session.discoverToken && req.session.discoverToken.includes(id)) {
                
                let pageTitle

                if (u.show_name){
                    pageTitle = `${u.show_name}'s Collection - artCollector`
                } else {
                    pageTitle = `${u.username}'s Collection - artCollector`
                };

                
                let artPieces = await ArtPiece.find({
                    archival: !{$in: [ 'true' ]},
                    user_id: `${u._id}`
                });

                res.render('discover_collection', { artPieces, user, moment: moment, pageTitle, styleSheet });

            } else {
                    if (req.session.discoverToken) {
                        req.flash('error', 'Sorry, you can browse only one collection at a time... Restart your browser if you wish to browse a different collection!')
                        res.redirect('/home')
                    } else {
                        if (u.share_pass === ''){
                            const pageTitle = `${u.show_name}'s Collection - artCollector`
                            let artPieces = await ArtPiece.find({
                                archival: !{$in: [ 'true' ]},
                                user_id: `${u._id}`
                            });
                            res.render('discover_collection', { artPieces, user, moment: moment, pageTitle, styleSheet });
                        } else {
                        req.flash('error', 'Wrong passcode, sorry...')
                        res.redirect('/home')
                        }
                    }
                };

        } 
    });
};

module.exports.discoverPiece = async (req, res, next) => {

    const { id } =  req.params; 
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        req.flash('error', `I'm sorry but I don't think what you're looking for exists in our database!`);
        res.redirect('/campgrounds');
    }
    const p = await ArtPiece.findById(id);

    const pageTitle = `${p.title} - artCollector`
    const styleSheet = 'show';

    let origin = req.get('Referrer');
    let owner = await User.findById({_id: p.user_id});
        username = owner.username
    if (origin && origin.includes('discover') && origin.includes(username)){
        res.render('discover_piece', { p, moment: moment, pageTitle, styleSheet, owner })
    } else {
        let msg = "Access forbidden"
        throw new ExpressError(msg, 400)
    }

};