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
        this.state = {encounterType:'combat'}

        this.module = this.module.bind(this)
        this.addMon = this.addMon.bind(this)
        this.removeMon = this.removeMon.bind(this)
        this.modMonAll = this.modMonAll.bind(this)
        this.modMonLvl = this.modMonLvl.bind(this)
        this.addEncounter = this.addEncounter.bind(this)
        this.removeEncounter = this.removeEncounter.bind(this)
        
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
                characters:res.characters,
                GM:res.GM,
                modules:modules
            })
        })
    }
    modMonAll = async (event) =>
    {
        this.setState({encounterID:event.target.value})
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
        this.setState({encounterID:event.target.value})
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
    addMon(event)
    {
        alert(this.state.encounterID)
    }
    addEncounter = async ()=>
    {
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
        }
        alert(JSON.stringify(type))
        const encounter = 
        {
            encounterName:this.state.encounterName,
            type:type
        }
        alert(JSON.stringify(encounter))
        await requestService.poster({url:"/findModule", content:{_id:this.state.thisModule._id}}).then(res=>
        {
            const modu = res
            modu.encounters.push(encounter)
            alert(JSON.stringify(modu))
            requestService.poster({url:"/upMod", content:{id:this.state.thisModule._id,update:modu}}).then(this.module)
        })
    }
    removeMon(event)
    {
        alert(event.target.value)
    }
    removeEncounter(event)
    {
        alert(event.target.value)
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
    change = (event) =>
    {
        let nam = event.target.name
        let val = event.target.value
    
        this.setState({[nam]:val})
    }
    nick = async (event) =>
    {

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
                characters:campaign.cha,
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
                    <h3>Module: {this.state.thisModule.moduleName} in campaign {this.state.thisModule.campaignName}</h3>
                    Level range from {this.state.thisModule.levels.from} to {this.state.thisModule.levels.to}<hr/>
                    {this.state.thisModule.characters[0] ? 
                        <div>
                            {this.state.thisModule.characters.map(char=>
                            <i>
                                {char}
                            </i>)}
                        </div>
                    :<i></i>}<br/>
                    {this.state.thisModule.encounters[0] ? 
                        <div>
                            {this.state.thisModule.encounters.map(encounter=>
                            <b>
                                {encounter.encounterName} ~
                                {encounter.type.social ? <b>~ a Social encounter.</b>:<i></i>}
                                {encounter.type.skill ? <b>~ a Skill encounter.</b>:<i></i>}
                                {encounter.type.combat ? 
                                    <b>
                                        ~ a Combat encounter;<br/>
                                        <button value={encounter._id} onClick={this.modMonLvl}>Add monsters of appropriate challenge rating</button>
                                        <br/>
                                        <button value={encounter._id} onClick={this.modMonAll}>Add monsters of any challenge rating</button>
                                    </b>
                                :<i></i>}
                                <button id="delButton" style={{float:"right"}} value={encounter._id} onClick={this.removeEncounter}>
                                    Delete {encounter.encounterName}
                                </button>
                                <hr/>
                            </b>)}
                        </div>
                    :<b></b>}
                        <input type="text" name="encounterName" onChange={this.change} required/>
                        <select name="encounterType" onChange={this.change}>
                            <option value="combat">Combat</option>
                            <option value="skill">Skill</option>
                            <option value="social">Social</option>
                        </select><br/>
                        <button onClick={this.addEncounter}>Add encounter</button>
                    <hr/>
                    {this.state.modMon ? 
                        <div>
                            {this.state.modMon.map((mon)=>
                            <div id="mainBox">
                                <b>~ {mon.monName} #{mon.number} ~</b><br/>
                                <b>Set nickname for monster;</b><br/>
                                <form onSubmit={this.nick}>
                                    <input name="monNick" className="bigInput" type="text" onChange={this.change}/>
                                    <input type="submit" className="bigInput" id="button" value="save nickname"/>
                                </form>
                                <button onClick={this.removeMon} value={mon._id}>
                                    Remove from {this.state.thisModule}
                                </button>
                            </div>)}<hr/>
                        </div>
                    :<i></i>}
                    {this.state.monsters ? 
                        <div>
                            {this.state.monsters.map((mon)=>
                            <div id="mainBox">
                                <b>{mon.name}</b><br/>
                                <i>{mon.size} {mon.monType}</i><hr/>
                                Challenge rating: {mon.CR}<br/>
                                Armour class: {mon.AC}<hr/>
                                <button id="button" className="bigInput" onClick={this.addMon} value={mon.name}>
                                    Add to {this.state.thisModule.moduleName}
                                </button>
                            </div>)}
                        </div>
                    :<div>
                    </div>}
                    </div>
                    :<i></i>}
            </div>
        )
    }
}

export default ModuleBuilder