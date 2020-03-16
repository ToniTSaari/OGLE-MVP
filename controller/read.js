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

exports.ability = async (req, res) =>
{
    var obj = req.body
    var read = ability.where({abilityName:obj.name})
    read.findOne(function(err, find)
    {
        if(err){console.log(err)}
        if(find)
        {
            console.log(find)
            res.json(find)
        }
        else
        {
            console.log('Nothing found!')
        }
    })
}

exports.character = async (req, res) =>
{
    var obj = req.body
    console.log(obj)
    var read = character.where(obj)
    read.findOne(function(err, find)
    {
        if(err){console.log(err)}
        if(find)
        {
            console.log('Found character by name: ' + find.charName + ' on ' + date)
            res.json(find)
        }
        else
        {
            console.log('Nothing found!')
        }
    })
}

exports.campaign = async (req, res) =>
{
    var obj = req.body
    var read = campaign.where(obj)
    read.findOne(function(err, find)
    {
        if(err){console.log(err)}
        if(find)
        {
            console.log(find)
            res.json(find)
        }
        else
        {
            console.log('Nothing found!')
        }
    })
}

exports.monster = async (req, res) =>
{
    var obj = req.body
    var read = monster.where(obj)
    read.findOne(function(err, find)
    {
        if(err){console.log(err)}
        if(find)
        {
            console.log(find)
            res.json(find)
        }
        else
        {
            console.log('Nothing found!')
        }
    })
}

exports.player = async (req, res) =>
{
    var obj = req.body
    console.log('Read request: ' + JSON.stringify(obj))
    var read = player.where(obj)
    read.findOne(function(err, find)
    {
        if(err){console.log(err)}
        if(find)
        {
            find.password = "It's a secret ;)"
            console.log('Found user ' + find.email + ' - ' + date)
            res.json(find)
        }
        else
        {
            var forbidden = {email:null}
            console.log('Nothing found!')
            res.json(forbidden)
        }
    })
}

exports.spell = (req, res) =>
{
    var obj = req.body
    var read = spell.where(obj)
    read.findOne(function(err, find)
    {
        if(err){console.log(err)}
        if(find)
        {
            console.log(find)
            res.json(find)
        }
        else
        {
            console.log('Nothing found!')
        }
    })
}

exports.weapon = (req, res) =>
{
    var obj = req.body
    var read = weapon.where(obj)
    read.findOne(function(err, find)
    {
        if(err){console.log(err)}
        if(find)
        {
            console.log(find)
            res.json(find)
        }
        else
        {
            console.log('Nothing found!')
        }
    })
}

exports.armour = (req, res) =>
{
    var obj = req.body
    var read = armour.where(obj)
    read.findOne(function(err, find)
    {
        if(err){console.log(err)}
        if(find)
        {
            console.log(find)
            res.json(find)
        }
        else
        {
            console.log('Nothing found!')
        }
    })
}

exports.race = (req, res) =>
{
    var obj = req.body
    console.log(obj)
    var read = race.where(obj)
    read.findOne(function(err, find)
    {
        if(err){console.log(err)}
        if(find)
        {
            console.log(find)
            res.json(find)
        }
        else
        {
            console.log('Nothing found!')
        }
    })
}

exports.charClass = (req, res) =>
{
    var obj = req.body
    console.log(obj)
    var read = Class.where(obj)
    read.findOne(function(err, find)
    {
        if(err){console.log(err)}
        if(find)
        {
            console.log(find)
            res.json(find)
        }
        else
        {
            console.log('Nothing found!')
        }
    })
}

exports.classList = (req, res) =>
{
    var obj = req.body
    var read = classList.where(obj)
    read.findOne(function(err, find)
    {
        if(err){console.log(err)}
        if(find)
        {
            console.log(find)
            res.json(find)
        }
        else
        {
            console.log('Nothing found!')
        }
    })
}