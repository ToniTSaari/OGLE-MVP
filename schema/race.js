const mongoose = require('mongoose')

const race = new mongoose.Schema(
    {
        raceName:{type:String, required:true},
        desc:String,
        stats:
        {
            str:{type:Number, default:0},
            con:{type:Number, default:0},
            dex:{type:Number, default:0},
            wis:{type:Number, default:0},
            int:{type:Number, default:0},
            cha:{type:Number, default:0}
        },
        age:[Number],
        alignment:[String],
        size:String,
        darkvision:{type:Boolean, default:false},
        racials:[String],
        racialWeapons:[String],
        racialArmours:[String],
        languages:[String],
        subraces:
        [{
            subName:{type:String},
            subDesc:String,
            stats:
            {
                str:{type:Number, default:0},
                con:{type:Number, default:0},
                dex:{type:Number, default:0},
                wis:{type:Number, default:0},
                int:{type:Number, default:0},
                cha:{type:Number, default:0}
            },
            racials:[String],
            racialWeapons:[String],
            racialArmours:[String]
        }]
    })

module.exports = mongoose.model("race", race)