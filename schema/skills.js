const mongoose = require('mongoose');

const skill = new mongoose.Schema(
{
    stat:String,
    skill:[String]
})

module.exports = mongoose.model('skill', skill)