const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    short_desc:{
        type: String,
        required: true,
    },
    phone_num:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        match: /.+\@.+\..+/, 
    },
    currency:{
        type: String,
        required: true,
    }
})
module.exports =  mongoose.model('Settings', settingSchema);