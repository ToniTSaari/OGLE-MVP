const mongoose = require('mongoose');

const friend = new mongoose.Schema(
{
    requester:String,
    requesterID:String,
    requestee:String,
    requesteeID:String
})

module.exports = mongoose.model('friend', friend)