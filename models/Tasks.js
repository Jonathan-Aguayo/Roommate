import { boolean } from 'joi';
import mongoose from 'mongoose';
import User from './User.js';
const TaskSchema = new mongoose.Schema({
    eventID: {type: String, required: true},
    title: {type: String, required: true},
    startDate: {type: Date, required: true,},
    dueDate: {type: Date, required: true,},
    assignedTo: {type: [User.schema], required:true},
    body: String,
    htmlLink: String,
    completed: boolean
})

const Task = mongoose.model('Task', TaskSchema);