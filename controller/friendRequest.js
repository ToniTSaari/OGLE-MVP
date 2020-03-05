const player = require('../schema/player');
const friend = require('../schema/friend')

const rawDate = new Date()
const date = rawDate.getHours() + ':'
            + rawDate.getMinutes() + ':'
            + rawDate.getSeconds() + ':'
            + rawDate.getMilliseconds() + ' - '
            + rawDate.getDate() + '.'
            + rawDate.getMonth() + '.'
            + rawDate.getFullYear()

exports.req = async (req,res)=>
{
    const obj = req.body
    console.log(obj)
    const friendReq = new friend(obj)
    console.log(friendReq)
    friendReq.save()
}

exports.gotList = async (req,res)=>
{
    const obj = req.body
    const friends = await friend.find({requestee:obj.email}).catch(console.log('No incoming friend requests.' + obj.email + ' - ' + date))
    var payload = []
    var i = 1
    friends.forEach((find)=>
    {
        console.log('Found incoming friend requests for: ' + find.requestee + ' - ' + date)
        payload[i] = 
        {
            reqID:find._id,
            requesterID:find.requesterID,
            requester:find.requester
        }
        i++
        const n = i-1
        payload[0] = {index:n}
    })
    res.send(payload)
}

exports.sentList = async (req,res)=>
{
    const obj = req.body
    const friends = await friend.find({requester:obj.email}).catch(console.log('No outgoing friend requests for:' + obj.email + ' - ' + date))
    var payload = []
    var i = 1
    friends.forEach((find)=>
    {
        console.log('Found outgoing friend requests by: ' + find.requester + ' - ' + date)
        payload[i] = 
        {
            reqID:find._id,
            requestee:find.requestee,
            requester:find.requester
        }
        i++
        const n = i-1
        payload[0] = {index:n}
    })
    res.send(payload)
}

exports.approve = async (req,res) =>
{
    var friendMail
    const obj = req.body
    console.log(obj)
    friend.findById(obj.reqID, (err,find)=>
    {
        if(err){console.log(err)}
        player.findById(find.requesterID, (err,doc) =>
        {
            if(err){console.log(err)}
            console.log(doc)
            doc.password = "It's a secret! o_~"
            var friend = doc.friends
            friend.push(find.requestee)
            console.log(friend)
            friendMail = doc.email
            player.findByIdAndUpdate(find.requesterID, {friends:friend}, {new:true}, (err,doc) =>
            {
                if(err){console.log(err)}
                console.log(doc)
            })
        })
        player.findById(find.requesteeID, (err, doc) =>
        {
            if(err){console.log(err)}
            var you = doc.friends
            doc.password = "It's a secret! o_~"
            you.push(friendMail)
            console.log(you)
            console.log(doc)
            player.findByIdAndUpdate(find.requesteeID, {friends:you}, {new:true}, (err,doc) =>
            {
                if(err){console.log(err)}
                console.log(doc)
            })
        })
    })
    friend.findByIdAndDelete(obj.reqID, (err,doc)=>
    {
        if(err){console.log(err)}
        console.log(doc)
    })
}

exports.decline = async (req,res) =>
{
    const obj = req.body
    friend.findByIdAndDelete(obj.reqID, (err,doc)=>
    {
        if(err){console.log(err)}
        console.log(doc)
    })
}