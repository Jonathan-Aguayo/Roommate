const mongoose = require('mongoose');
const mongo = require('mongodb');

const UserSchema = new mongoose.Schema({
    googleID: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, requried: true},
    email: {type: String, required: true, match:/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
    picture: {type: String, },
    household: {type: mongo.ObjectID},
})

const User = mongoose.model('User',UserSchema);
module.exports = User;
