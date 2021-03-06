import React from 'react'
import requestService from '../services/requestService'
import statService from '../services/statService'
import statMod from '../services/statModService'
import roller from '../services/rollService'

class PCCreateFormNew extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {value:''}
        this.state = {point:15}
        
        
        this.change = this.change.bind(this)
        this.pickClass = this.pickClass.bind(this)
        this.pickRace = this.pickRace.bind(this)
        this.pickSubRace = this.pickSubRace.bind(this)
        this.pickLevel = this.pickLevel.bind(this)
        this.pickSkill = this.pickSkill.bind(this)
        this.pickArmour = this.pickArmour.bind(this)
        this.pickMainHand = this.pickMainHand.bind(this)
        this.pickOffHand = this.pickOffHand.bind(this)
        this.buyWeapon = this.buyWeapon.bind(this)
        this.buyArmour = this.buyArmour.bind(this)
        this.learnSpell = this.learnSpell.bind(this)
        this.plus = this.plus.bind(this)
        this.minus = this.minus.bind(this)
        this.save = this.save.bind(this)
        this.resetSkills = this.resetSkills.bind(this)

        const defStats = statService.reset()
        const email = window.localStorage.getItem('email')
        const findUser = {url:"/findAcc", content:{email:email}}
        requestService.poster(findUser).then((res) => 
        {
            this.setState({email:res.email})
            this.setState({user:res.playerName})
            requestService.getter({url:"/listRace"}).then(res=>
            {
                this.setState({races:res})
                this.setState({rList:res.map(race=><option value={race.race}>{race.race}</option>)})
                requestService.getter({url:"/listClass"}).then(res=>
                {
                    
                    this.setState({Classes:res})
                    this.setState({cList:res.map(Class=><option value={Class.Class}>{Class.Class}</option>)})
                    this.setState({stats:defStats})
                    const levelPick = []
                    for(var i = 1; i <= 20; i++)
                    {
                        levelPick.push(i)
                    }
                    this.setState({levelPick:levelPick.map(level=><option value={level}>{level}</option>)})
                    this.setState({carry:150})
                    this.setState({weight:0})
                    this.refreshAC()
                    this.resetAttacks()
                })
            })
        })
    }
    resetAttacks()
    {
        this.setState({attacks:undefined})
        const strBonus = this.state.stats.str.bonus
        const unarmed = 1 + strBonus
        const attacks = []
        const attack = 
        {
            name:"Unarmed",
            flat:unarmed,
            mod:["Str: ",strBonus],
            types:["bludgeoning", "non-magical"]
        }
        attacks.push(attack)
        this.setState({attacks})
    }
    spellcaster(caster)
    {
        const leveling = this.state.leveling
        var level = 1
        if(this.state.level)
        {
            level = this.state.level
        }
        for(var i = 0; i < level; i++)
        {
            const stats = this.state.stats
            var casting = 0

            if(caster.str){ casting = stats.str.bonus }
            if(caster.dex){ casting = stats.dex.bonus }
            if(caster.con){ casting = stats.con.bonus }
            if(caster.int){ casting = stats.int.bonus }
            if(caster.wis){ casting = stats.wis.bonus }
            if(caster.cha){ casting = stats.cha.bonus }
            
            const slots = []
            const slotNames = ["Cantrips","1st","2nd","3rd","4th","5th","6th","7th","8th","9th"]
            const maxSlots = leveling[i].slots
            const sloLen = maxSlots.length
            for(var x = 0; x < sloLen; x++)
            {
                const slot = 
                {
                    name:slotNames[x],
                    amount:maxSlots[x]
                }
                slots.push(slot)
            }
            this.setState({casting})
            this.setState({spellslots:slots})
            this.setState({spells:leveling[i].spellsKnown})
        }
    }
    equipmentSetter()
    {
        const armourProf = this.state.armourProf
        const weaponProf = this.state.weaponProf
        const racialWeaponProf = this.state.racialWeapons
        const racialArmourProf = this.state.racialArmours
        const weapons = []
        const offHands = []
        const armours = []
        requestService.getter({url:"/listArmour"}).then(res=>
        {
            if(armourProf || racialArmourProf)
            {
                const armLen = res.length
                if(armourProf)
                {
                    const APLen = armourProf.length
                    for(var x = 0; x < APLen; x++)
                    {
                        const AP = armourProf[x].toLowerCase()
                        for(var y = 0; y < armLen; y++)
                        {
                            const group = res[y].group.toLowerCase()
                            if(AP === group && group !== "shield")
                            {
                                armours.push(res[y])
                            }
                            if(group === "shield" && AP === group)
                            {
                                offHands.push(res[y])
                            }
                        }
                    }
                }
                
                if(racialArmourProf && racialArmourProf[0])
                {
                    for(y = 0; y < armLen; y++)
                    {
                        const armour = res[y]
                        const name = armour.name.toLowerCase()
                        if(racialArmourProf.includes(name,0))
                        {
                            armours.push(armour)
                        }
                        if(racialArmourProf.includes("Shield",0) && name === "shield" && !offHands.includes(armour,0))
                        {
                            offHands.push(armour)
                        }
                    }
                }
                if(armours[0])
                {
                    const armour = armours[0]
                    var armourCost = {}
                    if(armour.cost < 1)
                    {
                        const silver = armour.cost * 10
                        if(silver < 1)
                        {
                            const copper = silver * 10
                            armourCost = {amount:copper, type:"Copper"}
                        }
                        armourCost = {amount:silver, type:"Silver"}
                    }
                    else
                    {
                        armourCost = {amount:armour.cost, type:"Gold"}
                    }
                    this.setState({armourCost})
                }
            }
            requestService.getter({url:"/listWeapon"}).then(res=>
            {
                var WPLen = 0
                if(weaponProf)
                {
                    WPLen = weaponProf.length
                }
                const weaLen = res.length
                for(var x = 0; x < WPLen; x++)
                {
                    const WP = weaponProf[x].toLowerCase()
                    for(var y = 0; y < weaLen; y++)
                    {
                        var offHandleable = false
                        const weapon = res[y]
                        const group = weapon.group
                        const name = weapon.name.toLowerCase()
                        if(WP === group || WP === name)
                        {
                            weapons.push(weapon)
                            offHandleable = true
                        }
                        const properties = weapon.properties
                        if(offHandleable && properties.includes("light",0) && !offHands.includes(weapon,0))
                        {
                            offHands.push(weapon)
                        }
                    }
                }
                if(racialWeaponProf && racialWeaponProf[0])
                {
                    for(y = 0; y < weaLen; y++)
                    {
                        offHandleable = false
                        const weapon = res[y]
                        const name = weapon.name
                        if(racialWeaponProf.includes(name,0))
                        {
                            weapons.push(weapon)
                            offHandleable = true
                        }
                        const properties = weapon.properties
                        if(offHandleable && properties.includes("light",0) && !offHands.includes(weapon,0))
                        {
                            offHands.push(weapon)
                        }
                    }
                }
                const weapon = weapons[0]
                const baseCost = weapon.cost
                var weaponCost = {}
                if(baseCost < 1)
                {
                    const silver = weapon.cost * 10
                    if(silver < 1)
                    {
                        const copper = silver * 10
                        weaponCost = {amount:copper, type:"Copper"}
                    }
                    weaponCost = {amount:silver, type:"Silver"}
                }
                else
                {
                    weaponCost = {amount:baseCost, type:"Gold"}
                }
                this.setState({offHands})
                this.setState({weaponCost})
                this.setState({armours})
                this.setState({weapons})
                this.setState({offHandList:offHands.map(off=><option value={off.name}>{off.name}</option>)})
                this.setState({weaponList:weapons.map(wea=><option value={wea.name}>{wea.name}</option>)})
                if(armours[0])
                {
                    this.setState({armourList:armours.map(arm=><option value={arm.name}>{arm.name}</option>)})
                }
            })
        })
    }
    refreshAttack()
    {
        
        const strBonus = this.state.stats.str.bonus
        const dexBonus = this.state.stats.str.bonus
        const attacksOld = this.state.attacks
        const attacksNew = []
        const attLen = attacksOld.length
        for(var i = 0; i < attLen; i++)
        {
            const attack = attacksOld[i]
            if(attack.name === "Unarmed")
            {
                if(this.state.MartialArts)
                {
                    attack.dice = this.state.MartialArts
                    if(dexBonus > strBonus)
                    {
                        attack.mod[0] = "Dex: "
                        attack.mod[1] = dexBonus
                    }
                }
                else
                {
                    attack.flat = 1 + strBonus
                }
            }
            if(attacksOld[i].mod[0] === "Str:")
            {
                attack.mod[1] = strBonus
            }
            else
            {
                attack.mod[1] = dexBonus
            }
            attacksNew.push(attack)
        }
        this.setState({attacks:attacksNew})
    }
    buyWeapon(event)
    {
        var carry = this.state.carry
        const attacks = this.state.attacks
        const strBonus = this.state.stats.str.bonus
        const dexBonus = this.state.stats.dex.bonus
        var money = this.state.money
        const weaponName = event.target.value
        requestService.poster({url:"/findWeapon", content:{weaponName:weaponName}}).then(res=>
        {
            //var range = []
            var mod = ["Str: ",strBonus]
            const properties = res.properties
            const proLen = properties.length
            for(var i = 0; i < proLen; i++)
            {
                if(properties[i] === "finesse")
                {
                    mod = ["Dex: ", dexBonus]
                }
            }
            /*if(res.range[0])
            {
                mod = ["Dex: ", dexBonus]
                range = res.range
            }*/
            const weapon = res
            money -= weapon.cost
            const attack = 
            {
                name:weapon.weaponName,
                dice:res.damage.dice,
                mod:mod,
                types:res.damage.damageType
            }
            attacks.push(attack)
            const weight = weapon.weight
            carry -= weight
            this.setState({carry, weight, attacks, money})
            this.refreshAttack()
        })
    }
    refreshAC()
    {
        const dexBonus = this.state.stats.dex.bonus
        const dexMax = this.state.dexMax
        const ACBase = this.state.ACBase
        if(this.state.AC)
        {
            var AC = this.state.AC
            if(this.state.dexMax && dexBonus > dexMax)
            {
                AC = dexMax + ACBase
            }
            else
            {
                AC = dexBonus + ACBase
            }
            this.setState({AC})
        }
        else
        {
            this.setState({AC:dexBonus})
        }
    }
    buyArmour(event)
    {
        var carry = this.state.carry
        var money = this.state.money
        const dexBonus = this.state.stats.dex.bonus
        alert(money)
        const armourName = event.target.value
        alert(event.target.value)
        requestService.poster({url:"/findArmour", content:{armourName:armourName}}).then(res=>
        {
            const dexMax = res.dex
            var AC = res.AC
            const ACBase = res.AC
            const weight = res.weight
            const armour = res
            carry -= weight
            money -= armour.cost
            if(dexBonus <= dexMax)
            {
                AC += dexBonus
            }
            else
            {
                AC += dexMax
            }
            if(res.noisy)
            {
                this.setState({noisy:true})
            }
            this.setState({carry, weight, AC, money, dexMax, ACBase})
        })
    }
    learnSpell(event){}
    pickLevel(event)
    {
        var money = 0
        var magItem = 0
        var magLevel = 1
        const classMoney = this.state.classMoney
        const level = event.target.value
        var point = this.state.point
        const features = []
        this.setState({level})
        if(level < 5)
        {
            money = 0
        }
        if(level >= 5)
        {
            money = 500
            money += (roller(1,10) * 25)
        }
        if(level >= 11)
        {
            money = 5000
            money += (roller(1,10) * 250)
            magItem = 1
        }
        if(level >= 17)
        {
            money = 20000
            money += (roller(1,10) * 250)
            magItem = 2
        }
        if(classMoney){ money = money + classMoney }
        magItem = magItem * magLevel
        if(this.state.thisClass)
        {
            const data = {className:this.state.thisClass.className}
            requestService.poster({url:"/findClass", content:data}).then(res=>
            {
                for(var i = 0; i < level; i++)
                {
                    const fList = res.leveling[i].features
                    const fLen = fList.length
                    if(res.leveling[i].spellcasting)
                    {
                        const caster = res.leveling[i].spellcasting
                        this.spellcaster(caster)
                    }   
                    for(var x = 0; x < fLen; x++)
                    {
                        const feature = fList[x]
                        features.push(feature)
                        if(feature === "Ability Score Improvement")
                        {
                            point += 2
                            this.setState({ASImp:true})
                        }
                        if(feature === "Martial Artist")
                        {
                            var MA = [1,4]
                            if(level > 4){ MA = [1,6] }
                            if(level > 10){ MA = [1,8] }
                            if(level > 16){ MA = [1,10] }
                            this.setState({MartialArts:MA})
                            this.refreshAttack()
                        }
                    }
                }
                this.setState({features})
                this.setState({point})
                this.setState({money})
            })
        }
    }
    pickRace(event)
    {
        const defStats = statService.reset()
        this.setState({stats:defStats})
        this.setState({SRList:undefined})
        this.setState({subrace:undefined})
        var point = 15
        if(this.state.features)
        {
            const fList = this.state.features
            const fLen = fList.length
            for(var x = 0; x < fLen; x++)
            {
                const feature = fList[x]
                if(feature === "Ability Score Improvement")
                {
                    point += 2
                    this.setState({ASImp:true})
                    this.statButtonReset() 
                }
            }
            this.setState({point:point})
        }
        else
        {
            this.setState({point:15})
        }
        document.getElementById('initRace').disabled = true
        this.statButtonReset()
        const raceName = event.target.value
        requestService.poster({url:"/findRace", content:{raceName:raceName}}).then(res=>
        {
            if(res.subraces[0].subName)
            {
                this.setState({SRList:res.subraces.map(sub=><option value={sub.subName}>{sub.subName}</option>)})
                document.getElementById('initSubRace').disabled = false
            }
            this.setState({subraces:res.subraces})
            const str = this.state.stats.str.base + res.stats.str
            const dex = this.state.stats.dex.base + res.stats.dex
            const con = this.state.stats.con.base + res.stats.con
            const int = this.state.stats.int.base + res.stats.int
            const wis =  this.state.stats.wis.base + res.stats.wis
            const cha = this.state.stats.cha.base + res.stats.cha

            const stats =
            {
                str:{total:str, bonus:statService.bonus(str), race:res.stats.str},
                dex:{total:dex, bonus:statService.bonus(dex), race:res.stats.dex},
                con:{total:con, bonus:statService.bonus(con), race:res.stats.con},
                int:{total:int, bonus:statService.bonus(int), race:res.stats.int},
                wis:{total:wis, bonus:statService.bonus(wis), race:res.stats.wis},
                cha:{total:cha, bonus:statService.bonus(cha), race:res.stats.cha}
            }
            const racials = []

            const racLen = res.racials.length
            for(let i = 0; racLen >= i; i++)
            { if(res.racials[i]){ racials.push( res.racials[i] ) } }
            this.setState({stats})
            if(this.state.HP)
            {
                const HP = this.state.HP
                HP.HPBonus = stats.con.bonus
                HP.HPCurrent = HP.HPBonus + HP.HPaverage
                this.setState({HP})
            }
            this.setState({racials})
            this.setState({racialsBase:racials})
            this.setState({thisRace:raceName})
            this.setState({racialArmours:res.racialArmours})
            this.setState({racialWeapons:res.racialWeapons})
            this.setState({racialArmoursBase:res.racialArmours})
            this.setState({racialWeaponsBase:res.racialWeapons})
            if(this.state.weaponProf || this.state.racialWeapons)
            {
                this.equipmentSetter()
            }
        })
    }
    pickSubRace(event)
    {
        const racials = []
        const racialsBase = this.state.racialsBase
        const racLen = racialsBase.length
        for(let i = 0; racLen >= i; i++)
        { if(racialsBase[i]){ racials.push( racialsBase[i] ) } }
        this.setState({racials:racials})

        this.setState({racialWeapons:undefined})
        const racialWeapons = this.state.racialWeaponsBase
        this.setState({racialWeapons})

        this.setState({racialArmours:undefined})
        const racialArmours = this.state.racialArmoursBase
        this.setState({racialArmours})
        document.getElementById('initSubRace').disabled = true
        var i = 0
        var subrace = {}
        var stats = this.state.stats
        const subLength = this.state.subraces.length
        for(i = 0; subLength > i; i++)
        {
            if(this.state.subraces[i].subName === event.target.value)
            {
                subrace = this.state.subraces[i]
            }
        }
        stats.str.race += subrace.stats.str
        stats.dex.race += subrace.stats.dex
        stats.con.race += subrace.stats.con
        stats.int.race += subrace.stats.int
        stats.wis.race += subrace.stats.wis
        stats.cha.race += subrace.stats.cha

        stats.str.total += subrace.stats.str
        stats.dex.total += subrace.stats.dex
        stats.con.total += subrace.stats.con
        stats.int.total += subrace.stats.int
        stats.wis.total += subrace.stats.wis
        stats.cha.total += subrace.stats.cha

        this.setState({stats:stats}, () =>
        {
            var racials = []
            var racialArmours
            var racialWeapons

            racials = this.state.racials
            if(this.state.racialArmours && this.state.racialArmours[0]) 
            { racialArmours = this.state.racialArmours }
            else{ racialArmours = [] }    
            if(this.state.racialWeapons && this.state.racialWeapons[0]) 
            { racialWeapons = this.state.racialWeapons }
            else{ racialWeapons = [] }

            const subracials = subrace.racials
            const subWeapons = subrace.racialWeapons
            const subArmours = subrace.racialArmours
            const racLen = subracials.length
            for(i = 0; racLen >= i; i++)
                { if(subracials[i]){ racials.push( subracials[i] ) } }

            const racArmLen = subArmours.length
            for(i = 0; racArmLen >= i; i++)
                { if(subArmours[i]){ racialArmours.push( subArmours[i] ) } } 

            const racWeaLen = subWeapons.length
            for(i = 0; racWeaLen >= i; i++)
                { if(subWeapons[i]){ racialWeapons.push( subWeapons[i] ) } }

            this.setState({thisRace:subrace.subName}, () =>
            {
                this.setState({thisSubrace:subrace.subName})
                this.setState({racials:racials})
                this.setState({racialWeapons})
                this.setState({racialArmours},()=>
                {
                    if(this.state.weaponProf || this.state.racialWeapons)
                    {
                        this.equipmentSetter()
                    }
                })
            })
        })
    }
    pickClass(event)
    {
        this.resetAttacks()
        this.refreshAC()
        this.setState({mainHand:undefined})
        this.setState({weaponProf:undefined})
        this.setState({armourProf:undefined})
        var money = 0
        var magItem = 0
        var point = this.state.point
        var level = 1
        if(this.state.level)
        {
            level = this.state.level
        }
        if(level < 5)
        {
            money = 0
        }
        if(level >= 5)
        {
            money = 500
            money += (roller(1,10) * 25)
        }
        if(level >= 11)
        {
            money = 5000
            money += (roller(1,10) * 250)
            magItem = 1
        }
        if(level >= 17)
        {
            money = 20000
            money += (roller(1,10) * 250)
            magItem = 2
        }
        const features = []
        this.setState({thisClass:undefined})
        document.getElementById('initClass').disabled = true
        const className = event.target.value
        requestService.poster({url:"/findClass", content:{className:className}}).then(res=>
        {
            const arrLevel = level - 1
            money += res.wealth.average
            var anySkill = false
            const pBonus = res.leveling[arrLevel].proficiency
            var skillList = res.proficiencies.skills.skill
            const skillMax = res.proficiencies.skills.num
            anySkill = res.proficiencies.skills.any
            if(anySkill)
            {
                skillList = 
                [
                    "Athletics","Acrobatics", "Sleight of Hand", "Stealth","Arcana","History","Investigation", 
                    "Nature", "Religion","Animal Handling", "Insight", "Medicine", "Perception", "Survival",
                    "Deception", "Intimidation", "Performance", "Persuation"
                ]
            }
            const armourProf = res.proficiencies.armour
            const weaponProf = res.proficiencies.weapons
            this.setState({leveling:res.leveling})
            this.setState({weaponProf})
            if(armourProf[0])
            {
                this.setState({armourProf})
            }
            this.equipmentSetter()
            const HPCurrent = res.hitPoints.average + this.state.stats.con.bonus
            const HP = 
            {
                HPDice:res.hitPoints.dice,
                HPaverage:res.hitPoints.average,
                HPBonus:this.state.stats.con.bonus,
                HPCurrent:HPCurrent
            }
            const thisClass =
            {
                className:res.className
            }
            this.setState({thisClass})
            this.setState({HP})
            this.setState({skillList}, () =>
            {
                this.setState({skillMax})
            })
            
            this.setState({pBonus})
            this.setState({skillListFull:skillList})
            for(var i = 0; i < level; i++)
            {
                if(res.leveling[i].spellcasting)
                {
                    const caster = res.leveling[i].spellcasting
                    this.spellcaster(caster)
                }   
                const fList = res.leveling[i].features
                const fLen = fList.length
                for(var x = 0; x < fLen; x++)
                {
                    const feature = fList[x]
                    features.push(feature)
                    if(feature === "Ability Score Improvement")
                    {
                        point += 2
                        this.setState({ASImp:true})
                        this.statButtonReset()
                    }
                    if(feature === "Martial Artist")
                    {
                        var MA = [1,4]
                        if(level > 4){ MA = [1,6] }
                        if(level > 10){ MA = [1,8] }
                        if(level > 16){ MA = [1,10] }
                        this.setState({MartialArts:MA})
                        this.refreshAttack()
                    }
                }
            }
            this.setState({features})
            this.setState({point})
            this.setState({money})
            this.setState({classMoney:money})
        })
    }
    pickSkill(event)
    {
        const pick = event.target.value
        var picks = []
        var skillMax = this.state.skillMax
        const skillList = this.state.skillList
        const skillLen = skillList.length
        for(var i = 0; i < skillLen; i++)
        {
            if(skillList[i] === pick)
            {
                skillList.splice(i,1)
            }
        }
        if(this.state.skillPicks)
        {
            picks = this.state.skillPicks
        }
        picks.push(pick)
        skillMax -= 1
        this.setState({skillMax})
        this.setState({skillPicks:picks})
    }
    pickArmour(event)
    {
        const pick = event.target.value
        if(pick)
        {
            const armours = this.state.armours
            const Len = armours.length
            for(var i = 0; i < Len; i++)
            {
                if(pick === armours[i].name)
                {
                    this.setState({thisArmour:armours[i]})
                }
            }
        }
        else
        {
            this.setState({thisArmour:undefined})
        }
    }
    pickMainHand(event)
    {
        const pick = event.target.value
        const weapons = this.state.weapons
        const Len = weapons.length
        for(var i = 0; i < Len; i++)
        {
            if(pick === weapons[i].name)
            {
                const weapon = weapons[i]
                const baseCost = weapon.cost
                var weaponCost = {}
                if(baseCost < 1)
                {
                    const silver = weapon.cost * 10
                    if(silver < 1)
                    {
                        const copper = silver * 10
                        weaponCost = {amount:copper, type:"Copper", real:baseCost}
                    }
                    weaponCost = {amount:silver, type:"Silver", real:baseCost}
                }
                else
                {
                    weaponCost = {amount:baseCost, type:"Gold", real:baseCost}
                }
                this.setState({weaponCost})
                this.setState({mainHand:weapon})
            }
        }
    }
    pickOffHand(event)
    {
        const pick = event.target.value
        if(pick)
        {
            const offHands = this.state.offHands
            const Len = offHands.length
            for(var i = 0; i < Len; i++)
            {
                if(pick === offHands[i].name)
                {
                    const offHand = offHands[i]
                    const baseCost = offHand.cost
                    var offHandCost = {}
                    if(baseCost < 1)
                    {
                        const silver = offHand.cost * 10
                        if(silver < 1)
                        {
                            const copper = silver * 10
                            offHandCost = {amount:copper, type:"Copper", real:baseCost}
                        }
                        offHandCost = {amount:silver, type:"Silver", real:baseCost}
                    }
                    else
                    {
                        offHandCost = {amount:baseCost, type:"Gold", real:baseCost}
                    }
                    this.setState({offHandCost})
                    this.setState({offHand})
                }
            }
        }
        else
        {
            this.setState({offHand:undefined})
            this.setState({offHandCost:undefined})
        }
    }
    plus = (event) => 
    {
        var ASImp = false
        if(this.state.ASImp)
        {
            ASImp = true
        }
        const stat = event.target.value
        this.setState({plus:stat}, () =>
        {
            var stats = this.state.stats
            var point = this.state.point
            const mod = statMod.modPlus(stats,point,this.state.plus, ASImp)
            stats = mod.stats
            point = mod.point
            this.setState({point:point}, () =>
            {
                this.setState({stats:stats}, this.refreshAttack())
                if(stat === "con" && this.state.HP)
                {
                    const HP = this.state.HP
                    HP.HPBonus = this.state.stats.con.bonus
                    HP.HPCurrent = HP.HPBonus + HP.HPaverage
                    this.setState({HP})
                }
                if(stat === "str")
                {
                    const weight = this.state.weight
                    const str = this.state.stats.str.total
                    const carry = str * 15 - weight
                    this.setState({carry})
                }
                if(stat === "dex")
                {
                    this.refreshAC()
                }
            })
        })
    }
    minus = (event) =>
    {
        var ASImp = false
        if(this.state.ASImp)
        {
            ASImp = true
        }
        const stat = event.target.value
        this.setState({minus:stat}, () =>
        {
            var stats = this.state.stats
            var point = this.state.point
            const mod = statMod.modMinus(stats, point, this.state.minus, ASImp)
            stats = mod.stats
            point = mod.point
            this.setState({point:point}, () =>
            {
                this.setState({stats:stats}, this.refreshAttack())
                if(stat === "con" && this.state.HP)
                {
                    const HP = this.state.HP
                    HP.HPBonus = this.state.stats.con.bonus
                    HP.HPCurrent = HP.HPBonus + HP.HPaverage
                    this.setState({HP})
                }
                if(stat === "str")
                {
                    const weight = this.state.weight
                    const str = this.state.stats.str.total
                    const carry = str * 15 - weight
                    this.setState({carry})
                }
                if(stat === "dex")
                {
                    this.refreshAC()
                }
            })
        })
    }
    statButtonReset()
    {
        document.getElementById("strMinus").disabled = false
        document.getElementById("strPlus").disabled = false
        document.getElementById("dexMinus").disabled = false
        document.getElementById("dexPlus").disabled = false
        document.getElementById("conMinus").disabled = false
        document.getElementById("conPlus").disabled = false
        document.getElementById("intMinus").disabled = false
        document.getElementById("intPlus").disabled = false
        document.getElementById("wisMinus").disabled = false
        document.getElementById("wisPlus").disabled = false
        document.getElementById("chaMinus").disabled = false
        document.getElementById("chaPlus").disabled = false
    }
    resetSkills()
    {
        this.setState({skillPicks:undefined})
        const thisClass = this.state.thisClass.className
        requestService.poster({url:"/findClass", content:{className:thisClass}}).then(res=>
        {
            this.setState({skillList:res.proficiencies.skills.skill})
            this.setState({skillMax:res.proficiencies.skills.num})
        })
    }
    save(event)
    {
        var unfinished = true
        var statSet = false
        var HPSet = false
        var featuresSet = false
        var skillSet = false
        var stats = {}
        var skills = {}
        var HPCurrent = 0
        var features = []
        if(this.state.stats)
        { 
            stats = this.state.stats
            statSet = true
        }
        if(this.state.HP)
        {
            HPCurrent = this.state.HP.HPCurrent
            HPSet = true
        }
        if(this.state.features)
        {
            features =  this.state.features
            featuresSet = true
        }
        if(this.state.skillPicks)
        {
            skills = this.state.skillPicks
            skillSet = true
        }
        if(statSet && HPSet && featuresSet && skillSet)
        {
            unfinished = false
        }
        const character = 
        {
            unfinished:unfinished,
            stats:stats,
            HP:
            {
                maxHP:HPCurrent
            },
            features:features
        }
        alert(JSON.stringify(character))
    }
    change = (event) =>
    {
        let nam = event.target.name
        let val = event.target.value

        this.setState({[nam]:val})
    }
    render(props)
    {
        return(
        <div className="main">
            {this.state.user}<br/>
            {this.state.racialArmours ? <i>{this.state.racialArmours}</i>:<i></i>}<br/>
            {this.state.racialWeapons ? <i>{this.state.racialWeapons}</i>:<i></i>}
            <button onClick={this.save}>Report character</button><br/>
            {this.state.levelPick ? 
                <select onChange={this.pickLevel}>
                    {this.state.levelPick}
                </select>
            :<i></i>}<br/>
            {this.state.rList ? 
                <select onChange={this.pickRace}>
                    <option id="initRace"></option>
                    {this.state.rList}
                </select>
            :<i></i>}<br/>
            {this.state.SRList && this.state.SRList[0] ? 
                <select onChange={this.pickSubRace} id="subSelect">
                    <option id="initSubRace"></option>
                    {this.state.SRList}
                </select>
            :<i></i>}<br/>
            {this.state.cList ? 
                <select onChange={this.pickClass}>
                    <option id="initClass"></option>
                    {this.state.cList}
                </select>
            :<i></i>}<hr/>
            <div id="charSheet">
                {this.state.stats ? 
                    <div id="abilityBox">
                        <b>Points to spend on abililities: {this.state.point}</b>
                        <table>
                            <tr>
                                <th>Strength</th>
                                <td>{this.state.stats.str.total}</td>
                                <td>{this.state.stats.str.bonus}</td>
                                <td>~</td>
                                <button value="str" id="strPlus" onClick={this.plus}>+</button>
                                <button value="str" id="strMinus" onClick={this.minus}>-</button>
                            </tr>
                            <tr>
                                <th>Dexterity</th>
                                <td>{this.state.stats.dex.total}</td>
                                <td>{this.state.stats.dex.bonus}</td>
                                <td>~</td>
                                <button value="dex" id="dexPlus" onClick={this.plus}>+</button>
                                <button value="dex" id="dexMinus" onClick={this.minus}>-</button>
                            </tr>
                            <tr>
                                <th>Constitution</th>
                                <td>{this.state.stats.con.total}</td>
                                <td>{this.state.stats.con.bonus}</td>
                                <td>~</td>
                                <button value="con" id="conPlus" onClick={this.plus}>+</button>
                                <button value="con" id="conMinus" onClick={this.minus}>-</button>
                            </tr>
                            <tr>
                                <th>Intelligence</th>
                                <td>{this.state.stats.int.total}</td>
                                <td>{this.state.stats.int.bonus}</td>
                                <td>~</td>
                                <button value="int" id="intPlus" onClick={this.plus}>+</button>
                                <button value="int" id="intMinus" onClick={this.minus}>-</button>
                            </tr>
                            <tr>
                                <th>Wisdom</th>
                                <td>{this.state.stats.wis.total}</td>
                                <td>{this.state.stats.wis.bonus}</td>
                                <td>~</td>
                                <button value="wis" id="wisPlus" onClick={this.plus}>+</button>
                                <button value="wis" id="wisMinus" onClick={this.minus}>-</button>
                            </tr>
                            <tr>
                                <th>Charisma</th>
                                <td>{this.state.stats.cha.total}</td>
                                <td>{this.state.stats.cha.bonus}</td>
                                <td>~</td>
                                <button value="cha" id="chaPlus" onClick={this.plus}>+</button>
                                <button value="cha" id="chaMinus" onClick={this.minus}>-</button>
                            </tr>
                        </table>
                    </div>
                :<i></i>}
                {this.state.skillMax === 0 ? 
                    <div id="skillBox">
                        <b>~ Trained skills ~</b><hr/>
                        {this.state.skillPicks ?
                            <p>
                                {this.state.skillPicks.map(skill=>
                                <b>
                                    {skill}<br/>
                                </b>)}<hr/>
                                <button onClick={this.resetSkills}>Reset skills</button>
                            </p>
                        :<i></i>}
                    </div>
                    :<div id="skillBox">
                        {this.state.skillPicks ?
                            <p>
                                <b>~ Trained skills ~</b><hr/>
                                {this.state.skillPicks.map(skill=>
                                <b>
                                    {skill}<br/>
                                </b>)}
                            </p>
                        :<i></i>}
                        {this.state.skillList ? 
                            <p><b>~ Pickable skills ~</b><hr/>
                                <b>Choose {this.state.skillMax} skills;</b><br/>
                                {this.state.skillList.map(skill=>
                                <i>
                                    <button onClick={this.pickSkill} value={skill}>{skill}</button><br/>
                                </i>)}
                            </p>
                        :<i></i>}
                    </div>}
                <div id="HPAC">
                    {this.state.HP ? 
                        <p>
                            {this.state.thisClass ? 
                                <i>
                                    <b>~ HP for {this.state.thisClass.className} ~</b>
                                </i>
                            :<i></i>}<hr/>
                            Average: {this.state.HP.HPaverage}<br/>
                            Current: {this.state.HP.HPCurrent}<br/>
                            Health Die: {this.state.HP.HPDice}<br/>
                            Con-Bonus: {this.state.HP.HPBonus}
                        </p>
                    :<p></p>}
                    {this.state.AC ?
                        <p>
                            AC: {this.state.AC}
                        </p>
                    :<i></i>}
                    {this.state.carry ? 
                        <p>
                            <b>~ Maximum carryin capacity: {this.state.carry} ~</b><hr/>
                        </p>
                    :<i></i>}
                </div>
                <div id="featureBox">
                    {this.state.armourProf ?
                        <p>
                            <b>~ Armour proficiencies~</b><hr/>
                            {this.state.armourProf.map(arm=><i>{arm}<br/></i>)}
                        </p>
                    :<i></i>}
                    {this.state.weaponProf ?
                        <p>
                            <b>~ Weapon proficiencies~</b><hr/>
                            {this.state.weaponProf.map(wea=><i>{wea}<br/></i>)}
                        </p>
                    :<i></i>}
                    {this.state.racials ? 
                        <p>
                            <b>~ Racial features ~</b><hr/>
                            {this.state.racials.map(racial=>
                            <i>
                                {racial}<br/>
                            </i>)}
                        </p>
                    :<i></i>}
                    {this.state.features ? 
                        <p>
                            <b>~ Class features ~</b><hr/>
                            {this.state.features.map(feature=>
                            <i>
                                {feature}<br/>
                            </i>)}
                        </p>
                    :<i></i>}
                </div>
                <div id="attackBox">
                    {this.state.attacks ? 
                        <p>
                            <b>~ Attacks ~</b><hr/>
                            <table id="attackTable">
                                <tr>
                                    <th>Attack</th>
                                    <th>Damage</th>
                                    <th colSpan="2">Damage types</th>
                                    <th colSpan="2">Modifier</th>
                                </tr>
                                {this.state.attacks.map(attack=>
                                <tr>
                                    <td>{attack.name}</td>
                                    {attack.dice ? 
                                        <td>{attack.dice[0]}D{attack.dice[1]}</td>
                                        :<td>{attack.flat}</td>}
                                    <td>{attack.types[0]}</td>
                                    <td>{attack.types[1]}</td>
                                    <td>{attack.mod[0]}</td>
                                    <td>{attack.mod[1]}</td>
                                </tr>)}
                            </table>
                            
                        </p>
                    :<i></i>}
                </div>
                <div id="equipmentBox">
                    {this.state.money ?
                        <p>
                            <b>~ Current wealth ~</b><hr/>
                            Gold: {this.state.money}
                        </p>
                    :<i></i>}
                </div>
                <div id="spellBox">
                    {this.state.spellslots ? 
                        <p>
                            <b>~ Spellslots ~</b><hr/>
                            <table>
                                {this.state.spellslots.map(slots=>
                                <tr>
                                    <td>{slots.name}</td>
                                    <td>{slots.amount}</td>
                                </tr>)}
                            </table>
                        </p>
                    :<i></i>}
                </div>
                <div id="descriptionBox">
                    {this.state.thisArmour ? 
                        <div id="innerBox">
                            <b>~ Armour ~</b><hr/>
                            <b>{this.state.thisArmour.name} ~ {this.state.thisArmour.group}</b><br/>
                            <table>
                                <tr>
                                    <th>AC</th>
                                    <td>{this.state.thisArmour.AC}</td>
                                </tr>
                                <tr>
                                    <th>Dex bonus</th>
                                    <td>{this.state.thisArmour.dex}</td>
                                </tr>
                                <tr>
                                    <th>Str min</th>
                                    <td>{this.state.thisArmour.str}</td>
                                </tr>
                                {this.state.thisArmour.noisy ? 
                                    <tr>
                                        <th>Stealth</th>
                                        <td>Disadvantage</td>
                                    </tr>
                                :<i></i>}
                                <tr>
                                    <th>Weight</th>
                                    <td>{this.state.thisArmour.weight}</td>
                                </tr>
                                <tr>
                                    <th>Cost</th>
                                    <td>{this.state.thisArmour.cost}</td>
                                </tr>
                            </table>
                            {this.state.thisArmour.cost <= this.state.money 
                                && this.state.thisArmour.str <= this.state.stats.str.total ? 
                                <button value={this.state.thisArmour.name} onClick={this.buyArmour}>
                                    Buy {this.state.thisArmour.name}
                                </button>
                            :<button value={this.state.thisArmour.name} disabled="true">
                                Buy {this.state.thisArmour.name}
                            </button>}
                        </div>
                    :<i></i>}<br/>
                    {this.state.mainHand ? 
                        <div id="innerBox">
                            <b>{this.state.mainHand.name}</b><hr/>
                            {this.state.mainHand.twoHanded ? <b>two-handed ~ </b>:<i></i>}
                            <b>{this.state.mainHand.type} ~ {this.state.mainHand.group}</b><br/>                                    
                            <table>
                                <tr>
                                    <th>Damage</th>
                                    {this.state.mainHand.damage.dice[0] ? 
                                    <td>
                                        {this.state.mainHand.damage.dice[0]}D
                                        {this.state.mainHand.damage.dice[1]}
                                    </td>
                                    :<td>Special</td>}
                                </tr>
                                {this.state.mainHand.damage.dice[0] ? 
                                    <tr>
                                        <th>Damage types</th>
                                        {this.state.mainHand.damage.damageType.map(type=>
                                        <tr id="subList">
                                            <td>{type}</td>
                                        </tr>)}
                                    </tr>
                                :<i></i>}
                                {this.state.mainHand.properties[0] ? 
                                    <tr>
                                        <th>Properties</th>
                                        {this.state.mainHand.properties.map(prop=>
                                        <tr id="subList">
                                            <td>{prop}</td>
                                            {prop === "versatile" ? 
                                                <td>
                                                    ({this.state.mainHand.damage.dice[2]}D
                                                    {this.state.mainHand.damage.dice[3]})
                                                </td>
                                            :<i></i>}
                                        </tr>)}
                                    </tr>
                                :<i></i>}
                                <tr>
                                    <th>Weight</th>
                                    <td>{this.state.mainHand.weight}</td>
                                </tr>
                                {this.state.weaponCost ? 
                                    <tr>
                                        <th>Cost</th>
                                        <td>
                                            {this.state.weaponCost.amount} {this.state.weaponCost.type}
                                        </td>
                                    </tr>
                                :<i></i>}
                            </table>
                            {this.state.weaponCost.real <= this.state.money ? 
                                <button value={this.state.mainHand.name} onClick={this.buyWeapon}>
                                    Buy {this.state.mainHand.name}
                                </button>
                            :<button value={this.state.mainHand.name} disabled="true">
                                Buy {this.state.mainHand.name}
                            </button>}
                        </div>
                    :<i></i>}<br/>
                    {this.state.mainHand ?
                        <p>
                            {!this.state.mainHand.twoHanded ? 
                                <p>
                                    {this.state.offHand ? 
                                    <div id="innerBox">
                                        <b>{this.state.offHand.name}</b><hr/>
                                        {this.state.offHand.type ?
                                            <b>{this.state.offHand.type} ~ {this.state.offHand.group}</b>
                                        :<i></i>}<br/>    
                                        {!this.state.offHand.damage ? 
                                        <table>
                                            <tr>
                                                <th>AC</th>
                                                <td>{this.state.offHand.AC}</td>
                                            </tr>
                                            <tr>
                                                <th>Weight</th>
                                                <td>{this.state.offHand.weight}</td>
                                            </tr>
                                            <tr>
                                                <th>Cost</th>
                                                <td>{this.state.offHandCost.amount} {this.state.offHandCost.type}</td>
                                            </tr>
                                        </table>
                                        :<table>
                                        <tr>
                                            <th>Damage</th>
                                            {this.state.offHand.damage.dice[0] ? 
                                            <td>
                                                {this.state.offHand.damage.dice[0]}D
                                                {this.state.offHand.damage.dice[1]}
                                            </td>
                                            :<td>Special</td>}
                                        </tr>
                                        {this.state.offHand.damage.dice[0] ? 
                                            <tr>
                                                <th>Damage types</th>
                                                {this.state.offHand.damage.damageType.map(type=>
                                                <tr id="subList">
                                                    <td>{type}</td>
                                                </tr>)}
                                            </tr>
                                        :<i></i>}
                                        <tr>
                                            <th>Weight</th>
                                            <td>{this.state.offHand.weight}</td>
                                        </tr>
                                        {this.state.offHandCost ? 
                                            <tr>
                                                <th>Cost</th>
                                                <td>
                                                    {this.state.offHandCost.amount} {this.state.offHandCost.type}
                                                </td>
                                            </tr>
                                        :<i></i>}
                                    </table>}
                                    {this.state.offHandCost.real < this.state.money && this.state.offHand.name !== "Shield" ? 
                                        <button value={this.state.offHand.name} onClick={this.buyWeapon}>
                                            Buy {this.state.offHand.name}
                                        </button>
                                    :<p>
                                        {this.state.offHand.name === "Shield" ? 
                                        <button value={this.state.offHand.name} onClick={this.buyArmour}>
                                            Buy {this.state.offHand.name}
                                        </button>
                                        :<button value={this.state.offHand.name} disabled="true">
                                            Buy {this.state.offHand.name}
                                        </button>}
                                    </p>}
                                    </div>
                                    :<i></i>}
                                </p>
                            :<i></i>}
                        </p>
                    :<i></i>}
                    <div id="innerBox">
                        <b>~ Spell ~</b><hr/>
                    </div>
                    
                    {/*<div id="innerBox">
                        <b>~ Feature ~</b><hr/>
                    </div>*/}
                    

                </div>
                <div id="pickBox">
                    {this.state.armours ? 
                        <p>
                            {this.state.armours[0] ? 
                            <p>
                                <b>~ Pick an armour ~</b><hr/>
                                {this.state.armourList ? 
                                    <select onChange={this.pickArmour}>
                                        <option></option>
                                        {this.state.armourList}
                                    </select>
                                :<i></i>}
                            </p>
                            :<i></i>}
                        </p>
                    :<i></i>}
                    {this.state.weapons ? 
                        <p>
                            <b>~ Pick a main weapon ~</b><hr/>
                            {this.state.weaponList ? 
                                <select onChange={this.pickMainHand}>
                                    <option></option>
                                    {this.state.weaponList}
                                </select>
                            :<i></i>}
                        </p>
                    :<i></i>}
                    {this.state.mainHand ?
                        <p>
                            {!this.state.mainHand.twoHanded ? 
                                <b>~ Pick a off-hand weapon or shield ~<hr/>
                                <select onChange={this.pickOffHand}>
                                    <option></option>
                                    {this.state.offHandList}
                                </select></b>
                            :<i></i>}
                        </p>
                    :<i></i>}
                </div>
            </div>
        </div>
        )
    }
}

export default PCCreateFormNew