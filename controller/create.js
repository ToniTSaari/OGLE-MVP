const ability = require('../schema/ability')
const character = require('../schema/character')
const campaign = require('../schema/campaign')
const monster = require('../schema/monster')
const spell = require('../schema/spell')
const weapon = require('../schema/weapon')
const armour = require('../schema/armour')

const rawDate = new Date()
const date = rawDate.getHours() + ':'
            + rawDate.getMinutes() + ':'
            + rawDate.getSeconds() + ':'
            + rawDate.getMilliseconds() + ' --- '
            + rawDate.getDate() + '.'
            + rawDate.getMonth() + '.'
            + rawDate.getFullYear()

exports.ability = (req, res) =>
{
    var obj = req.body
    var abil = new ability(obj)
    abil.save().then(result =>{console.log('Ability ' + abil + ' created! ' + date)})
}

exports.character = (req, res) =>
{
    var obj = req.body
    var char = new character(obj)
    console.log(obj.proficiencies)
    char.save().then(result =>
        {
            console.log('Character ' + char.charName + ' created! ' + date)
            res.json(char)
        })
}

exports.campaign = (req, res) =>
{
    var obj = req.body
    console.log(obj)
    var camp = new campaign(obj)
    camp.save().then(result =>
    {
        console.log('Campaign ' + camp + ' created! ' + date)
        res.json(result)
    })
}

exports.monster = (req, res) =>
{
    var obj = req.body
    var mon = new monster(obj)
    mon.save().then(result =>{console.log('Monster ' + mon + ' created! ' + date)})
}

exports.spell = (req, res) =>
{
    var obj = req.body
    var mag = new spell(obj)
    mag.save().then(result =>{console.log('Spell ' + mag + ' created! ' + date)})
}

exports.weapon = (req, res) =>
{
    var obj = req.body
    var wep = new weapon(obj)
    wep.save().then(result =>{console.log('Weapon ' + wep + ' created! ' + date)})
}

exports.armour = (req, res) =>
{
    var obj = req.body
    var arm = new armour(obj)
    arm.save().then(result =>{console.log('Weapon ' + arm + ' created! ' + date)})
}