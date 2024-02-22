const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    name: {
        type: String,
        Required: true
    }
},{timestamps: true})

const TeacherModel = mongoose.model('teacher',TeacherSchema)
module.exports = TeacherModel