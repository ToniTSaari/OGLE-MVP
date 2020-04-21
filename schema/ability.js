const mongoose = require('mongoose');

const ability = new mongoose.Schema(
{
    abilityName:String,
    passive:{type:Boolean, default:false},
    duration:
    {
        num:Number,
        magnitude:String
    },
    description:[String]
})

module.exports = mongoose.model('ability', ability)