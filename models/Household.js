const mongoose = require('mongoose');
const mongodb = require('mongodb');
const User = require('./User');
const HouseHoldSchema = new mongoose.Schema({
    houseName: {type: String, required: true},
    calendarID: {type: String, required: true},
    owner: {type: mongodb.ObjectID, required: true },
    members: [User.schema],
    groups: [[User.schema], ],
    created: {type: Date, required: true, default: Date.now()},
    chores: [String],

});

const HouseHold = mongoose.model('HouseHold', HouseHoldSchema);
module.exports =  HouseHold;