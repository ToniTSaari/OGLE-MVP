const mongoose = require('mongoose');
const player = require('./player').schema
const character = require('./character').schema
const monster = require('./monster').schema

const campaign = new mongoose.Schema(
{
    campaignName:String,
    GM:[String],
    players:[String],
    characters:[character],
    monsters:[monster]
})

module.exports = mongoose.model('campaign', campaign)