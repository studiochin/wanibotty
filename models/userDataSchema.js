const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    userId: {type: String, require: true, unique: true},
    reminderFrequency: {type: String, require: false },
    bannerStyle: {type: String, require: false },
}, {timestamps: true});