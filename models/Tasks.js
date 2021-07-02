import mongoose from 'mongoose';
const mongodb = require('mongodb');
import User from './User.js';
const TaskSchema = new mongoose.Schema({
    household: mongodb.ObjectID,
    title: { type: String, required: true },
    body: { type: String, required: true },
    cost: float,
    completedBy: String,
    completed: {type: boolean, required: true },
})

const Task = mongoose.model('Task', TaskSchema);