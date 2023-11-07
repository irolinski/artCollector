const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const express = require; 

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    show_name: {
        type: String,
        default: null,
        trim: true,
        sparse: true
    },

    contact_info: {
        type: String,
        default: null,
        trim: true,
        sparse: true
    },

    custom_table: { 
        type: String,
        default: null,
        trim: true,
        sparse: true
    }
})

UserSchema.plugin(passportLocalMongoose);
//this is going to add a username and a password!!!

module.exports = mongoose.model('User', UserSchema);