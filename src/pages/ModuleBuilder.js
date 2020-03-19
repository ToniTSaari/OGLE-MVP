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
            const moduList = res.content.moduleList
            const moduLength = moduList.length
            const modules = []
            for(var i = 0; i < moduLength; i++)
            {
                modules.push(res.content.module[i])
            }
            this.setState(
            {
                campaign:res.campaignName,
                characters:res.characters,
                GM:res.GM,
                modMon:res.monsters,
                modules:modules,
                moduleName:"Enter name to construct new module!"
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
        const monster = event.target.value
        const modules = this.state.modules
        const modLen = modules.length
        for(var i = 0; i < modLen; i++)
        {
            if(modules[i]._id===this.state.thisModuleID)
            {
                const y = i
                const module = modules[i]
                alert(JSON.stringify(module))
                const monsters = []
                const thisCampaign = { campaignName:this.state.campaign }
                requestService.poster({url:"/findCampaign", content:thisCampaign}).then((res)=>
                {
                    var number = 1
                    const campaign = res
                    const len = module.monsters.length
                    for(var x = 0; x < len; x++)
                    {
                        if(module.monsters[x].name===monster)
                        {
                            number++
                        }
                    }
                    monsters.push({monName:monster, number:number, monNick:""})
                    campaign.content.module[y].monsters = monsters
                    alert(JSON.stringify(campaign))
                    requestService.poster({url:"/upCamp", content:{id:campaign._id, update:campaign}})
                    .then(window.location.reload())
                })
                break
            }
        }
    }
    removeMon(event)
    {
        alert(event.target.value)
    }
    module(event)
    {
        var module
        const modules = this.state.modules
        const modLen = modules.length
        for(var i = 0; i < modLen; i++)
        {
            if(modules[i]._id === event.target.value)
            {
                module = modules[i]
            }
        }
        this.setState(
        {
            thisModule:module.moduleName,
            thisModuleID:module._id,
            modMon:module.monsters
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
        alert(JSON.stringify(this.state))
        const data = {campaignName:this.state.campaign}
        requestService.poster({url:"/findCampaign", content:data}).then((res)=>
        {
            const campaign = res
            campaign.content.moduleList.push(this.state.moduleName)
            campaign.content.module.push({moduleName:this.state.moduleName})
            alert(JSON.stringify(campaign))
            requestService.poster({url:"/upCamp", content:{id:campaign._id, update:campaign}})
                .then(window.location.reload())
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
                <div id="mainBox"><b>{this.state.moduleName}</b>
                    <form onSubmit={this.submit}>
                        <input type="text" name="moduleName" className="bigInput" onChange={this.change} required/>
                        <input type="submit" value="New Module" id="button" className="bigInput"/>
                    </form>
                </div>
                    {this.state.modules ? 
                        <div className="main">
                            {this.state.modules.map((mod)=>
                            <div id="mainBox">
                                <button id="button" value={mod._id} onClick={this.module} className="bigInput">
                                    Modify {mod.moduleName}
                                </button>
                            </div>)}
                        </div>
                    :<i></i>}
                <hr/>
                {this.state.thisModule ? 
                <div>
                    <h3>Module: {this.state.thisModule}</h3>
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
                        <div><hr/>
                            {this.state.monsters.map((mon)=>
                            <div id="mainBox">
                                <b>{mon.name}</b><br/>
                                <i>{mon.size} {mon.monType}</i><hr/>
                                Challenge rating: {mon.CR}<br/>
                                Armour class: {mon.AC}<hr/>
                                <button id="button" className="bigInput" onClick={this.addMon} value={mon.name}>
                                    Add to {this.state.campaign}
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