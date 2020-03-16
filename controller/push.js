const ability = require('../schema/ability')
const character = require('../schema/character')
const campaign = require('../schema/campaign')
const monster = require('../schema/monster')
const player = require('../schema/player')
const spell = require('../schema/spell')
const weapon = require('../schema/weapon')
const armour = require('../schema/armour')
const race = require('../schema/race')
const Class = require('../schema/class')
const classList = require('../schema/classlist')

const rawDate = new Date()
const date = rawDate.getHours() + ':'
            + rawDate.getMinutes() + ':'
            + rawDate.getSeconds() + ':'
            + rawDate.getMilliseconds() + ' - '
            + rawDate.getDate() + '.'
            + rawDate.getMonth() + '.'
            + rawDate.getFullYear()

exports.ability = async (req, res) => {}

exports.campaign = async (req, res) =>
{
    const obj = req.body
    const id = obj.id
    console.log('Recieved object on ' + date + ';')
    console.log(obj)
    campaign.findByIdAndUpdate(id, obj, {new:true}, (err,doc)=>
    {
        if(err){console.log(err)}
        console.log('Wrote document on ' + date + ';')
        console.log(doc)
    })
}

exports.character = async (req, res) =>
{
    const obj = req.body
    const id = obj.id
    console.log(obj)
    character.findByIdAndUpdate(id, obj, {new:true}, (err,doc)=>
    {
        if(err){console.log(err)}
        console.log(doc)
    })
}

exports.Class = async (req, res) => {}
exports.classList = async (req, res) => {}
exports.monster = async (req, res) => {}

exports.player = async (req, res) => 
{
    const obj = req.body
    const campaign = obj.campaign
    console.log(obj)
    player.findById(obj.id, (err,doc) =>
    {
        if(err){console.log(err)}
        var campaigns = doc.campaigns
        campaigns.push(campaign)
        console.log(campaigns)
        player.findByIdAndUpdate(doc._id, {campaigns:campaigns}, {new:true}, (err,doc) =>
        {
            if(err){console.log(err)}
            doc.password = "Cheeky! ;D"
            console.log(doc)
        })
    })
}

exports.spell = async (req, res) => {}
exports.weapon = async (req, res) => {}
exports.armour = async (req, res) => {}
exports.race = async (req, res) => {}

