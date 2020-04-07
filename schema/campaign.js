const mongoose = require('mongoose');

const campaign = new mongoose.Schema(
{
    PCs:[String],
    NPCs:[String],
    modules:[String],
    campaignName:{type:String, unique:true},
    GM:{type:String, unique:false}
})

module.exports = mongoose.model('campaign', campaign)