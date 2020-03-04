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
            + rawDate.getMilliseconds() + ' - '
            + rawDate.getDate() + '.'
            + rawDate.getMonth() + '.'
            + rawDate.getFullYear()

exports.ability = async (req, res) =>
{
    ability.deleteOne({abilityName:req.body.name}, function(err)
    {
        if(err){console.log(err)}else{console.log('Ability deletion successful! ' + date)}
    })
}

exports.character = async (req, res) =>
{
    character.deleteOne({_id:req.body.id}, function(err)
    {
        if(err){console.log(err)}else{console.log('Character deletion successful! ' + date)}
    })
}

exports.campaign = async (req, res) =>
{
    campaign.deleteOne({campaignName:req.body.name}, function(err)
    {
        if(err){console.log(err)}else{console.log('Campaign deletion successful! ' + date)}
    })
}

exports.monster = async (req, res) =>
{
    monster.deleteOne({monsterName:req.body.name}, function(err)
    {
        if(err){console.log(err)}else{console.log('Monster deletion successful! ' + date)}
    })
}

exports.player = async (req, res) =>
{
    console.log(req.body)
    console.log('delete request by ' + JSON.stringify(req.body))
    player.deleteOne({email:req.body.email}, function(err, del)
    {
        if(err){console.log(err)}
        else
        {
            if(del){console.log('Player deletion successful! ' + del + ' - ' + date)}
            else{console.log('Deletion error!')}
        }
    })
}

exports.spell = (req, res) =>
{
    spell.deleteOne({spellName:req.body.name}, function(err)
    {
        if(err){console.log(err)}else{console.log('Spell deletion successful! ' + date)}
    })
}

exports.weapon = (req, res) =>
{
    weapon.deleteOne({weaponName:req.body.name}, function(err)
    {
        if(err){console.log(err)}else{console.log('Weapon deletion successful! ' + date)}
    })
}

exports.armour = (req, res) =>
{
    armour.deleteOne({armourName:req.body.name}, function(err)
    {
        if(err){console.log(err)}else{console.log('Weapon deletion successful! ' + date)}
    })
}