const player = require('../schema/player');

exports.approve = async (req,res) =>
{
    const obj = req.body
    console.log(obj)
    player.findById(obj.friendID, (err,friend) =>
    {
        if(err){console.log(err)}
        friend.password = "It's a secret! o_~"
        console.log(friend)
        const buddy = friend.friendRequestSent
        console.log(buddy)
    })
}

exports.decline = async (req,res) =>
{
    const obj = req.body
    player.findById(obj.ID, (err,friend) =>
    {
        if(err){console.log(err)}
        console.log(friend)
    })
}