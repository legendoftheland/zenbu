const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: true
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;