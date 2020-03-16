const mon = require('mongoose')
const spell = require('./schema/spell')
const race = require('./schema/race')
const weapon = require('./schema/weapon')
const armour = require('./schema/armour')
const classlist = require('./schema/classlist')
const Class = require('./schema/class')
const monster = require('./schema/monster')
const url = "mongodb://localhost:27017/ogl"
const fs = require('fs')

mon.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })

const spells = JSON.parse(fs.readFileSync('./ogl/spell/Spells.json'))
const spellLists = JSON.parse(fs.readFileSync('./ogl/spell/spellLists.json'))
const races = JSON.parse(fs.readFileSync('./ogl/creature/race.json'))
const weapons = JSON.parse(fs.readFileSync('./ogl/equipment/weapon.json'))
const armours = JSON.parse(fs.readFileSync('./ogl/equipment/armour.json'))

const barbarian = JSON.parse(fs.readFileSync('./ogl/class/barbarian.json'))
const bard = JSON.parse(fs.readFileSync('./ogl/class/bard.json'))
const cleric = JSON.parse(fs.readFileSync('./ogl/class/cleric.json'))
const druid = JSON.parse(fs.readFileSync('./ogl/class/druid.json'))
const fighter = JSON.parse(fs.readFileSync('./ogl/class/fighter.json'))
const monk = JSON.parse(fs.readFileSync('./ogl/class/monk.json'))
const paladin = JSON.parse(fs.readFileSync('./ogl/class/paladin.json'))
const ranger = JSON.parse(fs.readFileSync('./ogl/class/ranger.json'))
const rogue = JSON.parse(fs.readFileSync('./ogl/class/rogue.json'))
const sorcerer = JSON.parse(fs.readFileSync('./ogl/class/sorcerer.json'))
const warlock = JSON.parse(fs.readFileSync('./ogl/class/warlock.json'))
const wizard = JSON.parse(fs.readFileSync('./ogl/class/wizard.json'))
const monsters = JSON.parse(fs.readFileSync('./ogl/creature/monster.json'))

const classes = 
[
    barbarian,bard,cleric,druid,fighter,monk,paladin,ranger,rogue,sorcerer,warlock,wizard
]

try
{
    weapon.insertMany(weapons).then(console.log('Weapons database built'))
    armour.insertMany(armours).then(console.log('Armours database built'))
    race.insertMany(races).then(console.log('Races database built'))
    spell.insertMany(spells).then(console.log('Spells database built'))
    Class.insertMany(classes).then(console.log('Class database built!'))
    classlist.insertMany(spellLists).then(console.log('Spell lists built!'))
    monster.insertMany(monsters).then(console.log('Monster database built!'))
}
catch
{
    console.log('OGL build failed!')
}