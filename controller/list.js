const ability = require('../schema/ability')
const character = require('../schema/character')
const Class = require('../schema/class')
const classlist = require('../schema/classlist')
const campaign = require('../schema/campaign')
const monster = require('../schema/monster')
const player = require('../schema/player')
const spell = require('../schema/spell')
const weapon = require('../schema/weapon')
const armour = require('../schema/armour')
const race = require('../schema/race')

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
    const abilities = await ability.find({})
    const abilityMap = {}
    abilities.forEach((find) =>
    {
        abilityMap[find.abilityName] = find
    })
    res.send(abilityMap)
}

exports.character = async (req, res) =>
{
    const obj = req.body
    console.log("Finding characters of user: " + obj.email)
    const characters = await character.find({playerCharacter:{PC:true, email:obj.email}})
    var payload = []
    var i = 1
    console.log('Characters;')
    characters.forEach((find)=>
    {
        console.log(i + ': ' + find.charName + ' - ' + date)
        payload[i] = 
        {
            id:find._id,
            character:find.charName,
            race:find.race,
            stats:find.stats,
            Class:find.Classes[0],
            saving:find.saving,
            armour:find.proficiencies.armour,
            campaign:find.campaign,
            player:find.playerCharacter.email
        }
        i++
        const n = i-1
        payload[0] = {index:n}
    })
    res.send(payload)
}

exports.Class = async (req, res) =>
{
    const classes = await Class.find({})
    var payload = []
    var i = 1
    console.log('Listing all classes;')
    classes.forEach((find)=>
    {
        console.log('Found: ' + find.className + ' - ' + date)
        payload[i] = 
        {
            Class:find.className
        }
        i++
        const n = i-1
        payload[0] = {index:n}
    })
    res.send(payload)
}

exports.classList = async (req, res) =>
{
    const list = await classlist.find({})

    const listMap = {}

    list.forEach((find) =>
    {
        listMap[find.className] = find
    })
    console.log('List compiled!')
    console.log(listMap)
    res.json(listMap)
}

exports.campaign = async (req, res) =>
{
    const campaigns = await campaign.find({})
    const campaignMap = {}
    campaigns.forEach((find) =>
    {
        campaignMap[find.campaignName] = find
    })
    res.send(campaignMap)
}

exports.monster = async (req, res) =>
{
    const monsters = await monster.find({})
    var payload = []
    var i = 0
    console.log(monsters)
    console.log('Listing monsters;')
    monsters.forEach((find) =>
    {
        console.log('Found: ' + find.monsterName + ' - ' + date)
        payload[i] = 
        {
            name:find.monsterName,
            monType:find.monsterType,
            size:find.size,
            CR:find.CR,
            AC:find.AC
        }
        i++
    })
    res.send(payload)
}

exports.player = async (req, res) =>
{
    const players = await player.find({})
    const playerMap = {}
    players.forEach((find) =>
    {
        find.password = "It's a secret ;)"
        playerMap[find.playerName] = find
    })
    res.send(playerMap).catch()
}

exports.spell = async (req, res) =>
{
    const spells = await spell.find({level:req.content})
    const spellMap = {}
    spells.forEach((find) =>
    {
        spellMap[find.spellName] = find
    })
    console.log('List compiled!')
    res.json(spellMap).catch()
}

exports.weapon = async (req, res) =>
{
    const weapons = await weapon.find({})
    const weaponMap = {}
    weapons.forEach((find) =>
    {
        weaponMap[find.weaponName] = find
    })
    res.send(weaponMap)
}

exports.armour = async (req, res) =>
{
    const armours = await armour.find({})
    const armourMap = {}
    armours.forEach((find) =>
    {
        armourMap[find.armourName] = find
    })
    res.send(armourMap)
}

exports.race = async (req, res) =>
{
    const races = await race.find({})
    var payload = []
    var i = 1
    races.forEach((find)=>
    {
        console.log('Found: ' + find.raceName + ' - ' + date)
        payload[i] = 
        {
            race:find.raceName,
            desc:find.desc,
            stats:find.stats
        }
        i++
        const n = i-1
        payload[0] = {index:n}
    })
    res.send(payload)
}