const mongoose = require('mongoose');

const encounter = new mongoose.Schema(
{
    encounterName:String,
    level:Number,
    type:
    {
        social:{type:Boolean, default:false},
        combat:{type:Boolean, default:false},
        skill:{type:Boolean, default:false}
    },
    monsters:
    [{
        monName:String,
        nickname:String,
        Nth:Number
    }],
    npc:[String]
})

const modu = new mongoose.Schema(
{
    levels:
    {
        from:Number,
        to:Number
    },
    encounters:[encounter],
    campaignName:String,
    moduleName:{type:String, unique:true},
    GM:{type:String, unique:false},
    characters:[String]
})

module.exports = mongoose.model('module', modu)