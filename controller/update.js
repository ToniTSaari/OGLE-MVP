const ability = require('../schema/ability')
const character = require('../schema/character')
const campaign = require('../schema/campaign')
const monster = require('../schema/monster')
const player = require('../schema/player')
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
    ability.where({abilityName:req.body.name}).findOne(function(err,find)
    {
        if(err){console.log(err)}
        if(find)
        {
            find.set(req.body)
            find.save().then(
                console.log("Updated " + find + ' ' + date),
                res.sendStatus(200))
        }
        else{console.log('Nothing found!')}
    })
}

exports.character = (req, res) =>
{
    console.log(req.body)
    character.findOneAndUpdate({_id:req.body.id}, req.body.update, {new:true}, (err, doc) =>
    {
        if(err){console.log(err)}
        console.log(doc)
    })
}

exports.campaign = (req, res) =>
{
    console.log(req.body)
    campaign.findOneAndUpdate({_id:req.body.id}, req.body.update, {new:true}, (err, doc) =>
    {
        if(err){console.log(err)}
        doc.password = "It's a secret >:D"
        console.log(doc)
    })
}

exports.monster= (req, res) =>
{
    monster.where({monsterName:req.body.name}).findOne(function(err,find)
    {
        if(err){console.log(err)}
        if(find)
        {
            find.set(req.body)
            find.save().then(
                console.log("Updated " + find + ' ' + date),
                res.sendStatus(200))
        }
        else{console.log('Nothing found!')}
    })
}

exports.player = (req, res) =>
{
    console.log(req.body.id)
    console.log(req.body.update)
    player.findOneAndUpdate({_id:req.body.id}, req.body.update, {new:true}, (err, doc) =>
    {
        if(err){console.log(err)}
        doc.password = "It's a secret >:D"
        console.log(doc)
    })
    
}

exports.spell = (req, res) =>
{
    spell.where({spellName:req.body.name}).findOne(function(err,find)
    {
        if(err){console.log(err)}
        if(find)
        {
            find.set(req.body)
            find.save().then(
                console.log("Updated " + find + ' ' + date),
                res.sendStatus(200))
        }
        else{console.log('Nothing found!')}
    })
}

exports.weapon = (req, res) =>
{
    weapon.where({weaponName:req.body.name}).findOne(function(err,find)
    {
        if(err){console.log(err)}
        if(find)
        {
            find.set(req.body)
            find.save().then(
                console.log("Updated " + find + date + ' ' + date),
                res.sendStatus(200))
        }
        else{console.log('Nothing found!')}
    })
}

exports.armour = (req, res) =>
{
    armour.where({armourName:req.body.name}).findOne(function(err,find)
    {
        if(err){console.log(err)}
        if(find)
        {
            find.set(req.body)
            find.save().then(
                console.log("Updated " + find + date + ' ' + date),
                res.sendStatus(200))
        }
        else{console.log('Nothing found!')}
    })
}