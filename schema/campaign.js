const mongoose = require('mongoose');

const campaign = new mongoose.Schema(
{
    characters:[String],
    session:[{type:String, unique:true}],
    campaignName:{type:String, unique:true},
    GM:{type:String, unique:false}
})

module.exports = mongoose.model('campaign', campaign)