const mongoose = require('mongoose');

const modu = new mongoose.Schema(
{
    monsters:
    [{
        monName:String,
        nickname:String,
        number:Number
    }],
    sessions:[String],
    campaignName:{type:String, unique:true},
    moduleName:{type:String, unique:true},
    GM:{type:String, unique:false}
})

module.exports = mongoose.model('module', modu)