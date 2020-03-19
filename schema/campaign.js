const mongoose = require('mongoose');
const modu = require('./module').schema

const campaign = new mongoose.Schema(
{
    characters:[String],
    content:
    {
        moduleList:[String],
        module:[modu]
    },
    campaignName:{type:String, unique:true},
    GM:{type:String, unique:false}
})

module.exports = mongoose.model('campaign', campaign)