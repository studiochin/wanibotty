const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {type: String, require: true, unique: true},
    serverId: {type: String, require: true},
});