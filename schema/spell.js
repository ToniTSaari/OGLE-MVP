const mongoose = require('mongoose');

const spell = new mongoose.Schema(
{
    level:{type:String, required:true},
    spellName:{type:String, required:true, unique:true},
    school:{type:String, required:true},
    casting:
    {
        time:{type:String, default:"action"},
        ritual:{type:Boolean, default:false},
        concentration:{type:Boolean, default:false},
        duration:
        {
            instant:{type:Boolean, default:false},
            dispelled:{type:Boolean, default:false},
            mag:String,
            num:Number
        }
    },
    effect:
    {
        effectType:{type:String, default:"utility"},
        save:String,
        amount:[Number],
        higher:[Number],
        DoT:[Number],
        damageType:String,
        halfDamage:{type:Boolean, default:false},
        buff:[String],
        debuff:[String],
        multiTarget:[Number],
        heal:String,
        plusStat:String,
        plusNum:Number
    },
    range:{type:Number, default:0},
    highRange:{type:Number, default:0},
    AoE:[],
    components:[String],
    cost:{type:Number, default:0}
})

module.exports = mongoose.model('spell', spell)