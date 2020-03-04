const mongoose = require('mongoose');
const spell = require('./spell').schema

var monster = new mongoose.Schema(
{
    monsterName: {type:String, required:true},
    monsterType:String,
    size:String,
    alignment:[String],
    CR:Number,
    AC:Number,
    HP:
    {
        max:Number,
        current:Number
    },
    speed:Number,
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
        str:{type:Number, default:0},
        dex:{type:Number, default:0},
        con:{type:Number, default:0},
        int:{type:Number, default:0},
        wis:{type:Number, default:0},
        cha:{type:Number, default:0}
    },
    skills:
    [{
        skill:String,
        bonus:Number
    }],
    resistances:[String],
    damImmunities:[String],
    condImmunities:[String],
    senses:
    {
        extraSensory:
        [{
            sensoryType:String,
            distance:Number
        }],
        passivePerception:{type:Number, default:'10'}
    },
    languages:[String],
    spellcaster:
    {
        casterLevel:{type:Number, default:0},
        spellbook:[spell],
        maxSlots:[Number],
        currentSlots:[Number]
    },
    abilities:[String]
})

module.exports = mongoose.model('monster', monster)