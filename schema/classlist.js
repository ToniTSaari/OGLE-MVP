const mongoose = require('mongoose');

const list = new mongoose.Schema(
{
    "cantrips":[String],
    "1st":[String],
    "2nd":[String],
    "3rd":[String],
    "4th":[String],
    "5th":[String],
    "6th":[String],
    "7th":[String],
    "8th":[String],
    "9th":[String]
})

const classlist = new mongoose.Schema(
{
    "className":String,
    "list":list
})

module.exports = mongoose.model('classlist', classlist)