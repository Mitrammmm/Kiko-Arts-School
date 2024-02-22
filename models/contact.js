const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name:{
        type: String,
        Required: true,
    },
    email:{
        type: String,
        Required: true,
    },
    phone:{
        type: String,
        Required: true,
    },
    description:{
        type: String,
        Required: true,
    },
    
},{timestamps: true})

const UserModel = mongoose.model('contact',ContactSchema)

module.exports = ContactModel