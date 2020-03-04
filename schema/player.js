const mongoose = require('mongoose');

const player = new mongoose.Schema(
{
    playerName: {type:String, default:''},
    email: {type:String, trim:true, unique:true, required:true},
    password: {type:String, required:true},
    characters:[String],
    campaigns:[String],
    friends:[String],
    friendRequestSent:
    [{
        friend:String,
        ID:String
    }],
    friendRequestGot:
    [{
        friend:String,
        ID:String
    }]
})

module.exports = mongoose.model('player', player)