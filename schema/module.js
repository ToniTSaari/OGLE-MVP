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
        skill:
        {
            str:{type:Boolean, default:false},
            dex:{type:Boolean, default:false},
            con:{type:Boolean, default:false},
            int:{type:Boolean, default:false},
            wis:{type:Boolean, default:false},
            cha:{type:Boolean, default:false}
        },
        difficulty:Number
    },
    monsters:
    [{
        monName:String,
        nickname:String,
        Nth:Number,
        alive:{type:Boolean, default:true}
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
    PCs:[String],
    activeEncounter:String
})

module.exports = mongoose.model('module', modu)