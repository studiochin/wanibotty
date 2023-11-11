const { model, Schema } = require("mongoose");
const userSchema = new Schema({
    userId: {type: String, require: true, unique: true},
    serverId: {type: String, require: true},
});

module.exports = model('userSchema', userSchema);