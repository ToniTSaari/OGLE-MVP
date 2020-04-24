const mongoose = require('mongoose');

const character = new mongoose.Schema(
{
    playerCharacter:{PC:{type:Boolean, default:false}, email:String},
    alive:{type:Boolean, default:true},
    levelUp:{type:Boolean, default:false},
    unfinished:{type:Boolean, default:true},
    campaign:String,
    charName:String,
    race:String,
    Classes:[{Class:String, level:{type:Number, default:1}}],
    experience:{type:Number, default:0},
    alignment:[String],
    specialization:String,
    AC:Number,
    speed:Number,
    size:String,
    inspiration:Boolean,
    stealthDis:{type:Boolean,default:false},
    HP:
    {
        maxHP:Number,
        currentHP:Number,
        tempHP:Number
    },
    skills:
    {
        str:
        {
            trained:[String],
            expertise:[String]
        },
        dex:
        {
            trained:[String],
            expertise:[String]
        },
        con:
        {
            trained:[String],
            expertise:[String]
        },
        int:
        {
            trained:[String],
            expertise:[String]
        },
        wis:
        {
            trained:[String],
            expertise:[String]
        },
        cha:
        {
            trained:[String],
            expertise:[String]
        }
    },
    stats:
    {
        str:
        {
            base:{type:Number, default:10},
            bonus:{type:Number, default:0}
        },
        dex:
        {
            base:{type:Number, default:10}, 
            bonus:{type:Number, default:0}
        },
        con:
        {
            base:{type:Number, default:10}, 
            bonus:{type:Number, default:0}
        },
        int:
        {
            base:{type:Number, default:10}, 
            bonus:{type:Number, default:0}
        },
        wis:
        {
            base:{type:Number, default:10}, 
            bonus:{type:Number, default:0}
        },
        cha:
        {
            base:{type:Number, default:10}, 
            bonus:{type:Number, default:0}
        }
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
        bonus:Number
    },
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