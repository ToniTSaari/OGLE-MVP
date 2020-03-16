const mongoose = require('mongoose');

const session = new mongoose.Schema(
{
    monsters:[String],
    campaignName:{type:String, unique:true}
})

module.exports = mongoose.model('session', session)