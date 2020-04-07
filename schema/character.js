const mongoose = require('mongoose');

const character = new mongoose.Schema(
{
    playerCharacter:{PC:{type:Boolean, default:false}, email:String},
    alive:{type:Boolean, default:true},
    campaign:String,
    charName:String,
    race:String,
    Classes:[{Class:String, level:{type:Number, default:1}}],
    experience:{type:Number, default:0},
    alignment:{lawChaos:String,goodEvil:String},
    specialization:String,
    AC:Number,
    speed:Number,
    size:String,
    inspiration:Boolean,
    HP:
    {
        maxHP:{type:Number},
        currentHP:{type:Number}
    },
    stats:
    {
        str:{base:{type:Number, default:10}, bonus:{type:Number, default:0}},
        dex:{base:{type:Number, default:10}, bonus:{type:Number, default:0}},
        con:{base:{type:Number, default:10}, bonus:{type:Number, default:0}},
        int:{base:{type:Number, default:10}, bonus:{type:Number, default:0}},
        wis:{base:{type:Number, default:10}, bonus:{type:Number, default:0}},
        cha:{base:{type:Number, default:10}, bonus:{type:Number, default:0}}
    },
    saving:
    {
        str:{type:Boolean, default:false},
        dex:{type:Boolean, default:false},
        con:{type:Boolean, default:false},
        int:{type:Boolean, default:false},
        wis:{type:Boolean, default:false},
        cha:{type:Boolean, default:false}
    },
    proficiencies:
    {
        armour:[String],
        tools:String,
        skill:[String],
        expertize:Boolean,
        bonus:Number
    },
    pBonus:Number,
    spellcaster:
    {
        casterLevel:{type:Number, default:0},
        spellbook:[String],
        maxSlots:[Number],
        currentSlots:[Number]
    },
    features:[String]
})

module.exports = mongoose.model('character', character)