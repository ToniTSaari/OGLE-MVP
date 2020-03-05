const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const parser = require('body-parser')

const app = express()

app.use(parser.urlencoded({extended:true}));
app.use(parser.json());

const rAuth = require('./controller/auth')
const rDelete = require('./controller/delete')
const rRead = require('./controller/read')
const rList = require('./controller/list')
const rPut = require('./controller/update')
const rCreate = require('./controller/create')
const rFriend = require('./controller/friendRequest')

var url = "mongodb://localhost:27017/ogl"

const server = app.listen(3001, () =>{
    console.log(server.address().port)
});

mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })

app.post("/upAcc", rPut.player)

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
app.post("/listChar", rList.character)

/*
app.get("/listAbility", rList.ability)
app.get("/listArmour", rList.armour)
app.get("/listCampaign", rList.campaign)
app.post("/findSpells", rRead.classList)
app.get("/listMonster", rList.monster)
app.get("/listPlayer", rList.player)
app.get("/listSpell", rList.spell)
app.get("/listWeapon", rList.weapon)
*/

app.get("/listRace", rList.race)
app.get("/listClassSpell", rList.classList)
app.get("/listClass", rList.Class)

app.post("/makePC", rCreate.character)

app.post("/delAcc", rDelete.player)
app.post("/delChar", rDelete.character)

app.get("/", function(req,res)
{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get("/license", function(res)
{
    res.sendFile(path.join(__dirname, 'OGL-License.html'))
})