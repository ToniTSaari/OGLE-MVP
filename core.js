const express = require('express')
const socketIO = require('socket.io')
const mongoose = require('mongoose')
const path = require('path')
const parser = require('body-parser')
const app = express()
const server = require('http').createServer(app)
const io = socketIO(server, {pingInterval:1000})
const socket = require('./controller/socket')

app.use(parser.urlencoded({extended:true}));
app.use(parser.json());
socket.socket(io)

server.listen(3001, () =>{
    console.log(server.address().port)
});

module.exports.socket = socket

const rAuth = require('./controller/auth')
const rDelete = require('./controller/delete')
const rRead = require('./controller/read')
const rList = require('./controller/list')
const rPut = require('./controller/update')
const rPush = require('./controller/push')
const rCreate = require('./controller/create')
const rFriend = require('./controller/friendRequest')

var url = "mongodb://localhost:27017/ogl"

mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })

app.post("/upAcc", rPut.player)
app.post("/upCamp", rPut.campaign)
app.post("/upChar", rPut.character)
app.post("/upMod", rPut.modu)

app.post("/login", rAuth.login)
app.post("/signup", rAuth.signup)

app.post("/friendReq", rFriend.req)
app.post("/listGot", rFriend.gotList)
app.post("/listSent", rFriend.sentList)
app.post("/appFriend", rFriend.approve)
app.post("/decFriend", rFriend.decline)

app.post("/findAcc", rRead.player)
app.post("/findChar", rRead.character)
app.post("/findRace", rRead.race)
app.post("/findClass", rRead.charClass)
app.post("/findCampaign", rRead.campaign)
app.post("/findMon", rRead.monster)
app.post("/findModule", rRead.modu)

/*
app.get("/listAbility", rList.ability)

app.get("/listCampaign", rList.campaign)
app.post("/findSpells", rRead.classList)
app.get("/listPlayer", rList.player)
app.get("/listSpell", rList.spell)

*/

app.post("/listChar", rList.character)
app.get("/listRace", rList.race)
app.get("/listClassSpell", rList.classList)
app.get("/listClass", rList.Class)
app.get("/listMon", rList.monster)
app.get("/listArmour", rList.armour)
app.get("/listWeapon", rList.weapon)
app.get("/listSkills", rList.skill)

app.post("/makeChar", rCreate.character)
app.post("/makeCamp", rCreate.campaign)
app.post("/makeModule", rCreate.modu)

app.post("/pushPlayer", rPush.player)
app.post("/pushCamp", rPush.campaign)
app.post("/pushChar", rPush.character)

app.post("/delAcc", rDelete.player)
app.post("/delChar", rDelete.character)
app.post("/delMod", rDelete.modu)

app.get("/", function(req,res)
{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get("/license", function(req,res)
{
    res.sendFile(path.join(__dirname, 'OGL-License.html'))
})