import React from 'react'
import {BrowserRouter as Router, Link} from 'react-router-dom'
import requestService from '../services/requestService'

class ModuleBuilder extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {value:''}
        this.state = {index:1}
        this.state = {encounterName:'Unnamed combat encounter'}
        this.state = {difficulty:"1"}
        this.state = {ability:"str"}
        this.state = {encounterType:'combat'}

        this.module = this.module.bind(this)
        this.removeModule = this.removeModule.bind(this)
        this.addMon = this.addMon.bind(this)
        this.nameMon = this.nameMon.bind(this)
        this.removeMon = this.removeMon.bind(this)
        this.modNPC = this.modNPC.bind(this)
        this.removeNPC = this.removeNPC.bind(this)
        this.addTest = this.addTest.bind(this)
        this.modMonAll = this.modMonAll.bind(this)
        this.modMonLvl = this.modMonLvl.bind(this)
        this.addEncounter = this.addEncounter.bind(this)
        this.removeEncounter = this.removeEncounter.bind(this)
        this.addNPC = this.addNPC.bind(this)
        if(!window.localStorage.getItem('campaign'))
        {
            window.location.href = "/campaign"
        }
        const data =
        {
            url:"/findCampaign",
            content:
            {
                campaignName:window.localStorage.getItem('campaign')
            }
        }
        requestService.poster(data).then((res)=>
        {
            const moduList = res.modules
            const moduLength = moduList.length
            const modules = []
            for(var i = 0; i < moduLength; i++)
            {
                modules.push(res.modules[i])
            }
            this.setState(
            {
                campaign:res.campaignName,
                characters:res.PCs,
                NPCs:res.NPCs,
                GM:res.GM,
                modules:modules
            })
        })
    }
    modMonAll = async (event) =>
    {
        this.setState({thisEncounter:undefined})
        this.setState({encounterName:event.target.value})
        const monsters = []
        await requestService.getter({url:"/listMon"}).then((res)=>
        {
            const len = res.length
            for(var i = 0; i < len; i++)
            {
                monsters.push(res[i])
            }
            this.setState({monsters})
        })
    }
    modMonLvl = async (event) =>
    {
        this.setState({thisEncounter:undefined})
        this.setState({encounterName:event.target.value})
        const monsters = []
        await requestService.getter({url:"/listMon"}).then((res)=>
        {
            const len = res.length
            for(var i = 0; i < len; i++)
            {
                if(res[i].CR >= this.state.thisModule.levels.from && res[i].CR <= this.state.thisModule.levels.to)
                {
                    monsters.push(res[i])
                }
            }
            this.setState({monsters})
        })
    }
    modNPC = async (event) =>
    {
        const enc = event.target.value
        this.setState({thisEncounter:enc})
        this.setState({monsters:undefined})
    }
    addMon = async (event) =>
    {
        const encName = this.state.encounterName
        const monName = event.target.value
        var monNum = 1
        const modu = this.state.thisModule
        const encList = modu.encounters
        const encLen = encList.length
        for(var i = 0; i < encLen; i++)
        {
            if(encList[i].encounterName === encName)
            {
                const encounter = encList[i]
                const monList = encounter.monsters
                const monLen = monList.length
                for(var x = 0; x < monLen; x++)
                {
                    if(monList[x].monName === monName)
                    {
                        monNum++
                    }
                }
                const nick = monName + ' #' + monNum
                const monster =
                {
                    monName:monName,
                    nickname:nick,
                    Nth:monNum
                }
                encounter.monsters.push(monster)
                this.state.thisModule.encounters[i] = encounter
                this.setState({thisMonster:monster})
                this.setState({nickname:nick})
                this.setState({monsters:undefined})
            }
        }
    }
    nameMon(event)
    {
        const nick = event.target.value
        const encName = this.state.encounterName
        const modu = this.state.thisModule
        const encLen = modu.encounters.length
        const mon = this.state.thisMonster
        this.setState({thisMonster:undefined})
        for(var i = 0; i < encLen; i++)
        {
            if(modu.encounters[i].encounterName === encName)
            {
                const encounter = modu.encounters[i]
                const monList = encounter.monsters
                const monLen = monList.length
                for(var x = 0; x < monLen; x++)
                {
                    if(monList[x].monName === mon.monName && monList[x].Nth === mon.Nth)
                    {
                        encounter.monsters[x].nickname = nick
                    }
                }
                modu.encounters[i] = encounter
            }
        }
        requestService.poster({url:"/upMod", content:{id:modu._id, update:modu}})
    }
    addTest(event)
    {
        const enc = event.target.value
        this.setState({thisEncounter:enc})
        this.setState({monsters:undefined})
        const modu = this.state.thisModule
        const encList = modu.encounters
        const encLen = encList.length
        for(var i = 0; i < encLen; i++)
        {
            if(encList[i].encounterName === enc)
            {
                const test = encList[i].test
                test.skill = this.state.ability
                test.difficulty = this.state.difficulty
                encList[i].test = test
                modu.encounters = encList
                requestService.poster({url:"/upMod", content:{id:modu._id, update:modu}})
            }   
        }
    }
    addEncounter = async ()=>
    {
        const moduName = this.state.thisModule.moduleName
        const type = 
        {
            social:false,
            combat:false,
            skill:false
        }
        switch(this.state.encounterType)
        {
            case "combat":
                type.combat = true
                break
            case "social":
                type.social = true
                break
            case "skill":
                type.skill = true
                break
            default:
                alert('this.state.encounterType value not transmitted')
                alert('defaulting to "combat" encounter type')
                type.combat = true
        }
        const encounter = 
        {
            encounterName:this.state.encounterName,
            type:type
        }
        await requestService.poster({url:"/findModule", content:{_id:this.state.thisModule._id}}).then(res=>
        {
            const modu = res
            modu.encounters.push(encounter)
            requestService.poster({url:"/upMod", content:{id:modu._id,update:modu}})
            this.module({target:moduName})
        })
    }
    removeMon(event)
    {
        const monster = event.target.value
        const modu = this.state.thisModule
        const moduName = modu.moduleName
        const encList = modu.encounters
        const encLen = encList.length
        for(var i = 0; i < encLen; i++)
        {
            const monList = encList[i].monsters
            const monLen = monList.length
            for(var x = 0; x < monLen; x++)
            {
                if(monList[x].nickname === monster)
                {
                    monList.splice(x,1)
                    break
                }
            }
            encList[i].monsters = monList
        }
        modu.encounters = encList
        requestService.poster({url:"/upMod", content:{id:modu._id, update:modu}})
        .then(this.module({target:moduName}))
    }
    removeEncounter(event)
    {
        const encounter = event.target.value
        const moduName = this.state.thisModule.moduleName
        const moduID = this.state.thisModule._id
        const mod = this.state.thisModule
        requestService.poster({url:"/findModule", content:{moduleName:moduName}}).then(res=>
        {
            const enList = res.encounters
            const enLen = enList.length
            for(var i = 0; i < enLen; i++)
            {
                if(enList[i]._id === encounter)
                {
                    enList.splice(i,1)
                    break
                }
            }
            mod.encounters = enList
            requestService.poster({url:"/upMod", content:{id:moduID, update:mod}})
            this.module({target:moduName})
        })
    }
    module(event)
    {
        const modu = event.target.value
        this.setState({monsters:undefined})
        requestService.poster({url:"/findModule",content:{moduleName:modu}}).then((res)=>
        {
            this.setState({thisModule:res})
            window.localStorage.setItem('module', modu)
        })
    }
    removeModule(event)
    {
        const moduleID = event.target.value
        const moduleName = this.state.thisModule.moduleName
        requestService.poster({url:"/findCampaign", content:{campaignName:this.state.campaign}}).then(res=>
        {
            const campaign = res
            const moduLen = campaign.modules.length
            for(var i = 0; i < moduLen; i++)
            {
                const modu = campaign.modules[i]
                if(modu === moduleName)
                {
                    campaign.modules.splice(i,1)
                    break
                }
            }
            requestService.poster({url:"/upCamp", content:{id:campaign._id, update:campaign}})
        })
        requestService.poster({url:"/delMod", content:{id:moduleID}})
        setInterval(()=>
        {
            window.location.reload()
        },3000)
    }
    addNPC(event)
    {
        const modu = this.state.thisModule
        const thisEncounter = this.state.thisEncounter
        const NPC = event.target.value
        const encounters = modu.encounters
        const encLen = modu.encounters.length
        for(var i = 0; i < encLen; i++)
        {
            if(encounters[i].encounterName === thisEncounter)
            {
                encounters[i].npc.push(NPC)
            }
        }
        modu.encounters = encounters
        requestService.poster({url:"/upMod", content:{id:modu._id, update:modu}})
        this.module({target:modu.moduleName})
    }
    removeNPC(event)
    {
        alert(event.target.value)
    }
    change = (event) =>
    {
        let nam = event.target.name
        let val = event.target.value
        this.setState({[nam]:val})
    }
    submit = async (event) =>
    {
        event.preventDefault()
        const data = {campaignName:this.state.campaign}
        requestService.poster({url:"/findCampaign", content:data}).then((res)=>
        {
            const campaign = res
            campaign.modules.push(this.state.moduleName)
            requestService.poster({url:"/upCamp", content:{id:campaign._id, update:campaign}})
            const data =
            {
                campaignName:this.state.campaign,
                moduleName:this.state.moduleName,
                GM:campaign.GM,
                levels:
                {
                    from:this.state.lowLevel,
                    to:this.state.highLevel
                }
            }
            requestService.poster({url:"/makeModule", content:data}).then(window.location.reload())
        })
    }
    render()
    {
        return(
            <div className="main">
                {this.state.campaign ? 
                    <h3>
                        Campaign {this.state.campaign} by {this.state.GM} {this.state.characters[0] ? 
                            <b>
                                with characters;<br/>
                                {this.state.characters.map((char)=><i>{char}</i>)}
                            </b>
                        :<i></i>}
                    </h3>
                :<p></p>}
                <div id="mainBox">
                    <form onSubmit={this.submit}>
                        {this.state.moduleName ? <div><b>{this.state.moduleName}</b><br/>
                            Level range;<br/>
                            from <input type="number" className="levelBox" name="lowLevel" min="1" max="20" onChange={this.change} required/><br/>
                            <p>to <input type="number" className="levelBox" name="highLevel" min={this.state.lowLevel} onChange={this.change} max="20" required/></p><hr/>
                        </div>
                        :<b>Enter name to construct new module!<br/></b>}
                        <input type="text" name="moduleName" className="bigInput" onChange={this.change} required/>
                        <input type="submit" value="New Module" id="button" className="bigInput"/>
                    </form>
                </div>
                    {this.state.modules ? 
                        <div className="main">
                            {this.state.modules.map((mod)=>
                            <div id="mainBox">
                                <button id="button" value={mod} onClick={this.module} className="bigInput">
                                    Modify {mod}
                                </button>
                            </div>)}
                        </div>
                    :<i></i>}
                <hr/>
                {this.state.thisModule ? 
                <div id="mainBox">
                    <div id="gridBox">
                        <div id="innerBox">
                        <h3>Module: {this.state.thisModule.moduleName} in campaign {this.state.thisModule.campaignName}</h3>
                        Level range from {this.state.thisModule.levels.from} to {this.state.thisModule.levels.to}
                        <button id="delButton" style={{float:"right"}} value={this.state.thisModule._id} onClick={this.removeModule}>
                            Delete {this.state.thisModule.moduleName}
                        </button>
                    </div>
                        <div id="innerBox">
                            {this.state.NPCs[0] ? 
                                <div>
                                    <b>NPCs featured in {this.state.thisModule.campaignName};</b>
                                    <p>{this.state.NPCs.map(npc=><i>{npc}</i>)}</p><hr/>
                                    <Link to="/NPC" style={{width:"100%", textAlign:"center"}}>
                                        ~ Create a new NPC for {this.state.campaign} ~
                                    </Link>
                                </div>
                                :<div>
                                    No NPCs in {this.state.campaign}<hr/>
                                    <Link to="/NPC">
                                        ~ Create NPC for {this.state.campaign} ~
                                    </Link>
                            </div>}
                        </div>
                    </div><hr/>
                    {this.state.thisModule.encounters[0] ? 
                        <div id="gridBox">
                            {this.state.thisModule.encounters.map(encounter=>
                            <div id="innerBox">
                                <b>{encounter.encounterName}</b>
                                {encounter.type.social ? 
                                    <div>
                                        <i> a Social encounter;</i><br/>
                                        {encounter.npc[0] ? 
                                            <p>
                                                <b>Contains following NPCs;</b><br/>
                                                {encounter.npc.map(npc=>
                                                <i>
                                                    {npc} ~ 
                                                    <button value={npc} onClick={this.removeNPC}>
                                                        Remove {npc}
                                                    </button>
                                                </i>)}
                                            </p>
                                        :<i></i>}
                                        {this.state.thisEncounter === encounter.encounterName ?
                                        <div>
                                            {this.state.NPCs[0] ? 
                                            <div>
                                                {this.state.NPCs.map(NPC=>
                                                <button value={NPC} onClick={this.addNPC}>
                                                    Add {NPC} 
                                                </button>)}
                                            </div>
                                            :<div></div>}
                                        </div>
                                        :<div>
                                            <button style={{float:"right"}} value={encounter.encounterName} onClick={this.modNPC}>
                                                Modify NPCs of {encounter.encounterName}
                                            </button>
                                        </div>}
                                    </div>
                                :<i></i>}
                                {encounter.type.skill ? 
                                <div style={{display:"inline"}}>
                                    <i> a Skill encounter.</i><br/>
                                    {encounter.test.difficulty ?
                                        <i>
                                            A {encounter.test.skill} test of DC {encounter.test.difficulty}
                                        </i>
                                    :<p>
                                        <select name="ability" onChange={this.change}>
                                            <option value="strenght">Str</option>
                                            <option value="dexterity">Dex</option>
                                            <option value="constitution">Con</option>
                                            <option value="intelligence">Int</option>
                                            <option value="wisdom">Wis</option>
                                            <option value="charisma">Cha</option>
                                        </select><br/>
                                        <input min="1" max="30" type="number" name="difficulty" onChange={this.change}/><br/>
                                        <button value={encounter.encounterName} onClick={this.addTest}>
                                        Add skilltest
                                        </button>
                                    </p>}
                                </div>
                                :<i></i>}
                                {encounter.type.combat ? 
                                    <div style={{display:"inline"}}>
                                        <i> a Combat encounter;</i><br/>
                                        {encounter.monsters[0] ? 
                                            <p>
                                                {encounter.monsters.map(mon=>
                                                <i>
                                                    {mon.nickname} ~ {mon.monName} ~
                                                <button style={{float:"right"}} value={mon.nickname} onClick={this.removeMon}>
                                                    Remove {mon.nickname}
                                                </button><hr/>
                                                </i>)}
                                            </p>
                                        :<i></i>}
                                        <button value={encounter.encounterName} onClick={this.modMonLvl}>
                                            Add monsters of appropriate challenge rating
                                        </button>
                                        <br/>
                                        <button value={encounter.encounterName} onClick={this.modMonAll}>
                                            Add monsters of any challenge rating
                                        </button>
                                    </div>
                                :<i></i>}
                                <br/><p>
                                <button id="delButton" className="bottomRight" value={encounter._id} onClick={this.removeEncounter}>
                                    Delete {encounter.encounterName}
                                </button></p>
                            </div>)}
                        </div>
                    :<b></b>}
                    {this.state.thisMonster ? 
                        <div><hr/>
                            <b>{this.state.nickname} ~ {this.state.thisMonster.monName}</b><br/>
                            <input type="text" name="nickname" value={this.state.nickname} onChange={this.change}/><br/>
                            <button onClick={this.nameMon} value={this.state.nickname}>
                                Set nickname for this {this.state.thisMonster.monName}
                            </button>
                        </div>
                    :<i></i>}
                    {this.state.monsters ? 
                        <div><hr/>
                            {this.state.monsters.map((mon)=>
                            <div id="mainBox">
                                <b>{mon.name}</b><br/>
                                <i>{mon.alignment[0]} {mon.alignment[1]} {mon.size} {mon.monType}</i><hr/>
                                Challenge rating: {mon.CR}<br/>
                                XP yield: {mon.XP}<br/>
                                Armour class: {mon.AC}<hr/>
                                <button id="button" className="bigInput" onClick={this.addMon} value={mon.name}>
                                    Add to {this.state.thisModule.moduleName}
                                </button>
                            </div>)}
                        </div>
                    :<div>
                    </div>}
                    <hr/>
                        <p>
                            <b>Add new encounter;</b><br/>
                            {this.state.encounterName ? 
                            <i>
                                {this.state.encounterName} ~ {this.state.encounterType}
                            </i>
                            :<i></i>}
                        </p>
                        <input type="text" name="encounterName" onChange={this.change} required/>
                        <select name="encounterType" onChange={this.change}>
                            <option value="combat">Combat</option>
                            <option value="skill">Skill</option>
                            <option value="social">Social</option>
                        </select><br/>
                        <button id="button" onClick={this.addEncounter}>Add encounter</button>
                    </div>
                    :<i></i>}
            </div>
        )
    }
}

export default ModuleBuilder