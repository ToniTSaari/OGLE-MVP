import React from 'react'
import requestService from '../services/requestService'
import statService from '../services/statService'
import statMod from '../services/statModService'

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
        this.pickLevel = this.pickLevel.bind(this)
        this.pickSkill = this.pickSkill.bind(this)
        this.pickArmour = this.pickArmour.bind(this)
        this.pickMainHand = this.pickMainHand.bind(this)
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
                })
            })
        })
    }
    pickLevel(event)
    {
        const level = event.target.value
        var point = this.state.point
        const features = []
        this.setState({level})
        if(this.state.thisClass)
        {
            const data = {className:this.state.thisClass.className}
            requestService.poster({url:"/findClass", content:data}).then(res=>
            {
                for(var i = 0; i < level; i++)
                {
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
                        }
                    }
                }
                this.setState({features})
                this.setState({point})
            })
        }
    }
    pickClass(event)
    {
        var point = this.state.point
        var level = 1
        if(this.state.level)
        {
            level = this.state.level
        }
        const features = []
        this.setState({thisClass:undefined})
        document.getElementById('initClass').disabled = true
        const className = event.target.value
        requestService.poster({url:"/findClass", content:{className:className}}).then(res=>
        {
            var anySkill = false
            const pBonus = res.leveling[level].proficiency
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
            const armours = []
            const armourProf = res.proficiencies.armour
            const weapons = []
            const offHand = []
            const weaponProf = res.proficiencies.weapons
            requestService.getter({url:"/listArmour"}).then(res=>
            {
                const APLen = armourProf.length
                const armLen = res.length
                for(var x = 0; x < APLen; x++)
                {
                    const AP = armourProf[x].toLowerCase()
                    for(var y = 0; y < armLen; y++)
                    {
                        
                        const group = res[y].group.toLowerCase()
                        if(AP === group)
                        {
                            if(res[y].name === "Shield")
                            {
                                offHand[0] = res
                            }
                            else
                            {
                                armours.push(res[y])
                            }
                        }
                    }
                }
                requestService.getter({url:"/listWeapon"}).then(res=>
                {
                    const WPLen = weaponProf.length
                    const weaLen = res.length
                    for(var x = 0; x < WPLen; x++)
                    {
                        const WP = weaponProf[x].toLowerCase()
                        for(var y = 0; y < weaLen; y++)
                        {
                            const group = res[y].group
                            const name = res[y].name.toLowerCase()
                            if(WP === group || WP === name)
                            {
                                weapons.push(res[y])
                            }
                        }
                    }
                    this.setState({mainHand:weapons[0]})
                    this.setState({weaponProf})
                    if(armourProf[0])
                    {
                        this.setState({thisArmour:armours[0]})
                        this.setState({armourProf}) 
                        this.setState({armours:armours})
                    }
                    this.setState({weapons:weapons})
                    this.setState({weaponList:weapons.map(wea=><option value={wea.name}>{wea.name}</option>)})
                    this.setState({armourList:armours.map(arm=><option value={arm.name}>{arm.name}</option>)})
                })
            })
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
                }
            }
            this.setState({features})
            this.setState({point})
        })
    }
    pickRace(event)
    {
        const defStats = statService.reset()
        this.setState({stats:defStats})
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
            this.setState({SRList:res.subraces.map(sub=><option value={sub.subName}>{sub.subName}</option>)})
            
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
            { racials.push( res.racials[i] ) }
            this.setState({stats})
            if(this.state.HP)
            {
                const HP = this.state.HP
                HP.HPBonus = stats.con.bonus
                HP.HPCurrent = HP.HPBonus + HP.HPaverage
                this.setState({HP})
            }
            this.setState({racials})
        })
    }
    pickSubRace(event)
    {
        document.getElementById('initSubRace').disabled = true
        alert(event.target.value)
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
    pickMainHand(event)
    {
        const pick = event.target.value
        const weapons = this.state.weapons
        const Len = weapons.length
        for(var i = 0; i < Len; i++)
        {
            if(pick === weapons[i].name)
            {
                this.setState({mainHand:weapons[i]})
            }
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
                this.setState({stats:stats})
                if(stat === "con" && this.state.HP)
                {
                    const HP = this.state.HP
                    HP.HPBonus = this.state.stats.con.bonus
                    HP.HPCurrent = HP.HPBonus + HP.HPaverage
                    this.setState({HP})
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
                this.setState({stats:stats})
                if(stat === "con" && this.state.HP)
                {
                    const HP = this.state.HP
                    HP.HPBonus = this.state.stats.con.bonus
                    HP.HPCurrent = HP.HPBonus + HP.HPaverage
                    this.setState({HP})
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
            {this.state.SRList ? 
                <select onChange={this.pickSubRace}>
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
                        <b>~ Pickable skills ~</b><hr/>
                        {this.state.skillList ? 
                            <p>
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
                                    <b>HP for {this.state.thisClass.className};</b>
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

                        </p>
                    :<i></i>}
                </div>
                <div id="featureBox">
                    {this.state.armourProf ?
                        <p>
                            
                        </p>
                    :<i></i>}
                    {this.state.weaponProf ?
                        <p>

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
                    :<p><b>~ Racial features ~</b><hr/></p>}
                    {this.state.features ? 
                        <p>
                            <b>~ Class features ~</b><hr/>
                            {this.state.features.map(feature=>
                            <b>
                                {feature}<br/>
                            </b>)}
                        </p>
                    :<p><b>~ Class features ~</b><hr/></p>}
                </div>
                <div id="attackBox">
                    <b>Attacks</b><hr/>
                    
                </div>
                <div id="equipmentBox">
                    {this.state.armours ? 
                        <p>
                            <b>~ Pick an armour ~</b><hr/>
                            {this.state.armourList ? 
                                <select onChange={this.pickArmour}>
                                    {this.state.armourList}
                                </select>
                            :<i></i>}
                        </p>
                    :<i></i>}
                    {this.state.weapons ? 
                        <p>
                            <b>~ Pick a weapon ~</b><hr/>
                            {this.state.weaponList ? 
                                <select onChange={this.pickMainHand}>
                                    {this.state.weaponList}
                                </select>
                            :<i></i>}
                        </p>
                    :<i></i>}
                </div>
                <div id="spellBox"></div>
                <div id="descriptionBox">
                    {this.state.thisArmour ? 
                        <p>
                            <b>~ Armour ~</b><hr/>
                            {this.state.thisArmour.name} ~ {this.state.thisArmour.group}<br/>
                        </p>
                    :<i></i>}
                    {this.state.mainHand ? 
                        <p>
                            <b>{this.state.mainHand.name}</b><hr/>
                            {this.state.mainHand.twoHanded ? <b>two-handed ~ </b>:<i></i>}
                            <b>{this.state.mainHand.type} ~ {this.state.mainHand.group}</b><br/>                                    
                            <table>
                                <tr>
                                    <th>Weight</th>
                                    <td>{this.state.mainHand.weight}</td>
                                </tr>
                                <tr>
                                    <th>Damage</th>
                                    <td>
                                        {this.state.mainHand.damage.dice[0]}D
                                        {this.state.mainHand.damage.dice[1]}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Damage types</th>
                                    {this.state.mainHand.damage.damageType.map(type=>
                                    <tr id="subList">
                                        <td>{type}</td>
                                    </tr>)}
                                </tr>
                            </table>
                        </p>
                    :<i></i>}
                    <b>~ Spell ~</b><hr/>

                    <b>~ Feature ~</b><hr/>

                </div>
            </div>
        </div>
        )
    }
}

export default PCCreateFormNew