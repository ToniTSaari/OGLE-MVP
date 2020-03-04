const mongoose = require('mongoose');

const armour = new mongoose.Schema(
{
    armourName:String,
    group:String,
    cost:Number,
    AC:Number,
    dex:Number,
    str:Number,
    noisy:Boolean,
    weight:Number
})

module.exports = mongoose.model('armour', armour)