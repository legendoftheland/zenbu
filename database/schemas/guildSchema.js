const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    verificationType: {
        type: String,
        required: false
    },
    verificationEmailDomain: {
        type: String,
        required: false
    },
    verificationRole: {
        type: String,
        required: false
    }
})

const Guild = mongoose.model('Guild', guildSchema);
module.exports = Guild;