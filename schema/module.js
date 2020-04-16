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
    test:
    {
        skill:String,
        difficulty:Number,
        success:
        {
            collective:{type:Boolean, default:false},
            individual:[String],
            successful:{type:Boolean,default:false}
        }
    },
    monsters:
    [{
        monName:String,
        nickname:String,
        Nth:Number,
        alive:{type:Boolean, default:true},
        CR:Number,
        XP:Number
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
    activeEncounter:String
})

module.exports = mongoose.model('module', modu)