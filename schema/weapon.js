const mongoose = require('mongoose');

const weapon = new mongoose.Schema(
{
    weaponName:String,
    group:[String],
    cost:Number,
    weight:Number,
    damage:
    {
        dice:[Number],
        damageType:[String]
    },
    properties:[String],
    range:[Number],
    twohanded:Boolean
})

module.exports = mongoose.model('weapon', weapon)