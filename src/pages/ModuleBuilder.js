import React from 'react'
import requestService from '../services/requestService'

class ModuleBuilder extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {value:''}
        this.state = {index:1}

        this.module = this.module.bind(this)
        this.addMon = this.addMon.bind(this)
        this.removeMon = this.removeMon.bind(this)
        this.modMon = this.modMon.bind(this)
        
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
    modMon = async () =>
    {
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
    addMon(event)
    {
        alert('empty for now')
    }
    removeMon(event)
    {
        alert(event.target.value)
    }
    module(event)
    {
        requestService.poster({url:"/findModule",content:{moduleName:event.target.value}}).then((res)=>
        {
            this.setState({thisModule:res})
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
                <div>
                    <h3>Module: {this.state.thisModule.moduleName} in campaign {this.state.thisModule.campaignName}</h3>
                    Level range from {this.state.thisModule.levels.from} to {this.state.thisModule.levels.to}<hr/>
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
                    :<div><button onClick={this.modMon}>Modify monsters</button></div>}
                    </div>
                    :<i></i>}
            </div>
        )
    }
}

export default ModuleBuilder