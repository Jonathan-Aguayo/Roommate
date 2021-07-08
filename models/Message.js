const mongoose = require('mongoose');
const mongodb = require('mongodb');
const User = require('./User');
const MessageSchema = new mongoose.Schema({
    household: mongodb.ObjectID,
    title: { type: String, required: true },
    body: { type: String, required: true },
    postedOn: { type: Date, required: true},
    completed: Boolean,
    postedBy: User.schema,
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;