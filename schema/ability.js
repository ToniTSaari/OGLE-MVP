const mongoose = require('mongoose');

const ability = new mongoose.Schema(
{
    abilityName:String,
    
})

module.exports = mongoose.model('ability', ability)