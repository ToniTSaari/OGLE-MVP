const mongoose = require('mongoose');

const player = new mongoose.Schema(
{
    playerName: {type:String, default:''},
    email: {type:String, trim:true, unique:true, required:true},
    password: {type:String, required:true},
    campaigns:[String],
    friends:[String],
    activeCampaign:String
})

module.exports = mongoose.model('player', player)