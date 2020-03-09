const mongoose = require('mongoose');

const campaign = new mongoose.Schema(
{
    campaignName:String,
    GM:[String],
    players:[String],
    characters:
    {
        charName:String,
        charID:String
    },
    monsters:
    {
        monName:String,
        monID:String
    }
})

module.exports = mongoose.model('campaign', campaign)