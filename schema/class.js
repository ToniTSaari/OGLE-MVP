const mongoose = require('mongoose');

const Class = new mongoose.Schema(
{
    className:{type:String, required:true},
    hitPoints:
    {
        dice:Number,
        average:Number
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
    wealth:
    {
        diceNum:Number,
        diceDie:Number,
        multiplier:Number,
        average:Number
    },
    proficiencies:
    {
        armour:[String],
        weapons:[String],
        tools:String,
        skills:
        {
            num:Number,
            any:Boolean,
            skill:[String]
        },
        learnSpells:{type:Boolean, default:false}
    },
    leveling:
    [
        /*{
            proficiency:Number,
            features:[String],
            classResources:
            [
                {
                    name:String,
                    amount:Number
                }
            ],
            spellsKnown:Number,
            slots:[Number],
            abilities:
            [
                {
                    name:String,
                    amount:String
                }
            ]
        }*/
    ]
})

module.exports = mongoose.model('Class', Class)