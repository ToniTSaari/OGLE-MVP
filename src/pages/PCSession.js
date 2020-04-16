import React from 'react'
import requestService from '../services/requestService'
import socketService from '../services/socketService'
import rollService from '../services/rollService'
import Timer from '../services/getTime'

var time
Timer.stamp(clock=>
{
    time = clock
})

class SessionPage extends React.Component
{
    constructor(props)
    {
        super(props)
        window.localStorage.setItem('followback', true)
        this.state = {value:''}
        this.state = {events:[]}

        this.change = this.change.bind(this)
        this.submit = this.submit.bind(this)
        this.roll = this.roll.bind(this)

        const campName = window.localStorage.getItem('campaign')
        const charName = window.localStorage.getItem('character')

        const user = window.localStorage.getItem('user')
        requestService.poster({url:"/findChar", content:{charName:charName}}).then(res=>
        {
            if(campName === res.campaign)
            {
                const campaign = res.campaign
                requestService.poster({url:"/findCampaign", content:{campaignName:campaign}}).then(res=>
                {
                    const modu = res.activeModule
                    this.setState({campaign:res})
                    requestService.poster({url:"/findModule", content:{moduleName:modu}}).then(res=>
                    {
                        this.setState({module:res})
                        const session =
                        {
                            event:'session',
                            data:modu
                        }
                        socketService.emitter(session)
                        const msg = user + " joined session"
                        const data = {msg:msg, time:time}
                        const joinMsg = 
                        {
                            event:"room",
                            data:
                            {
                                event:"event",
                                data:data,
                                room:modu,
                                sender:user
                            }
                        }
                        socketService.emitter(joinMsg)
                        this.setState({room:modu})
                        this.setState({user})
                        if(res.activeEncounter)
                        {
                            const encLen = res.encounters.length
                            for(var i = 0; i < encLen; i++)
                            {
                                if(res.encounters[i].encounterName === res.activeEncounter)
                                {
                                    const thisEncounter = res.encounters[i]
                                    this.setState({thisEncounter})
                                    const PClist = this.state.campaign.PCs
                                    const PCnum = PClist.length
                                    const PCs = []
                                    for(var n = 0; n < PCnum; n++)
                                    {
                                        const PC = PClist[n]
                                        requestService.poster({url:"/findChar", content:{charName:PC}}).then(res=>
                                        {
                                            if(res.playerCharacter.playerName === user)
                                            {
                                                this.setState({self:res})
                                            }
                                            else
                                            {
                                                PCs.push(res)
                                            }
                                        })
                                    }
                                    this.setState({PCs})
                                    if(thisEncounter.type.combat)
                                    {
                                        const monsters = thisEncounter.monsters
                                        const monLen = monsters.length
                                        const monData = []
                                        for(var x = 0; x < monLen; x++)
                                        {
                                            const thisMon = monsters[x]
                                            requestService.poster({url:"/findMon", content:{monsterName:monsters[x].monName}})
                                            .then(res=>
                                            {
                                                const monster =
                                                {
                                                    nickname:thisMon.nickname,
                                                    Nth:thisMon.Nth,
                                                    alive:thisMon.alive,
                                                    data:res
                                                }
                                                monData.push(monster)
                                            })
                                        }
                                        this.setState({monsters:monData}, () =>
                                        {
                                            const msg = "Starting Encounter"
                                            const events = this.state.events
                                            events.push(msg)
                                            this.setState({events})
                                            this.setState({latest:msg})
                                        })
                                    }
                                }
                            }
                        }
                    })
                })
            }
            else
            {
                alert('Database Error!')
            }
        })
        setInterval(()=>
        {
            if(this.state.latest)
            {
                const event = window.localStorage.getItem('event')
                const sender = window.localStorage.getItem('sender')
                const user = this.state.user
                const latest = this.state.latest.msg
                if(latest !== event || window.localStorage.getItem('followback') === true)
                {
                    Timer.stamp(clock=>
                    {
                        time = clock
                    })
                    const message = {msg:event, stamp:time}
                    this.setState({latest:message})
                    const events = this.state.events
                    events.push(message)
                    this.setState({events}, () =>
                    {
                        if(user !== sender)
                        {
                            const followback = 
                            {
                                event:"followback", data:
                                {
                                    event:"followback", 
                                    room:this.state.room,
                                    sender:user
                                }
                            }
                            socketService.emitter(followback)
                        }
                    })
                    window.localStorage.removeItem('event')   
                }
            }
            else
            {
                const message = {msg:"Initializing message system", stamp:time}
                this.setState({latest:message})
            }
        },3000)
    }
    change = (event) =>
    {
        document.getElementById('init').disabled = true
        document.getElementById('roller').disabled = false
        let nam = event.target.name
        let val = event.target.value
        this.setState({[nam]:val})
    }
    roll()
    {
        Timer.stamp(clock=>
        {
            time = clock
        })
        document.getElementById('roller').disabled = true
        const player = this.state.user
        const die = this.state.diceDie
        var num = this.state.diceNum
        if(!num){num=1}
        if(die)
        {
            const roll = rollService(num, die)
            const msg = 'player ' + player + ' rolls ' + num + 'D'+ this.state.diceDie + ' = ' + roll
            const data = {msg:msg, time:time}
            socketService.emitter(
            {
                event:"room",
                data:
                {
                    event:"event",
                    data:data,
                    room:this.state.room,
                    sender:player
                }
            })
        }
        else
        {
            const msg = 'Player ' + player + ' mimes a roll without a die in hand'
            const data = {msg:msg, time:time}
            socketService.emitter(
            {
                event:"room",
                data:
                {
                    event:"event",
                    data:data,
                    room:this.state.room,
                    sender:player
                }
            })
        }
    }
    submit = async (event) =>
    {
        
    }
    render()
    {
        return(
        <div className="main">
            {this.state.thisEncounter ? 
            <div id="mainBox">
                <h3>{this.state.thisEncounter.encounterName}</h3>
                <button onClick={this.back}>Back</button><hr/>
                <div id="eventGrid">
                    {this.state.PCs ?
                        <p>
                            {this.state.PCs.map(pc=>
                                <div id="PCBox">
                                    <b>{pc.charName} ~ level {pc.Classes[0].level} {pc.Classes[0].Class}</b><hr/>
                                    <p>
                                        STR: {pc.stats.str.base} / + {pc.stats.str.bonus}<br/>
                                        DEX: {pc.stats.dex.base} / + {pc.stats.dex.bonus}<br/>
                                        CON: {pc.stats.con.base} / + {pc.stats.con.bonus}<br/>
                                        INT: {pc.stats.int.base} / + {pc.stats.int.bonus}<br/>
                                        WIS: {pc.stats.wis.base} / + {pc.stats.wis.bonus}<br/>
                                        CHA: {pc.stats.cha.base} / + {pc.stats.cha.bonus}<br/>
                                    </p>
                                </div>)}
                        </p>
                        :<div id="PCBox">Loading</div>}
                        {this.state.events[0] ? 
                            <div>
                                <div id="eventBox">
                                    {this.state.events.map(event => 
                                    <b>
                                        {event.msg ? 
                                            <div>{event.stamp}: {event.msg}</div>
                                        :<i></i>}
                                    </b>)}
                                </div>
                            </div>
                        :<i></i>}
                    {this.state.thisEncounter.type.skill ? 
                        <div>
                            skill
                        </div>
                    :<i></i>}
                    {this.state.thisEncounter.type.social ? 
                        <div>
                            
                        </div>
                    :<i></i>}
                    {this.state.thisEncounter.type.combat ? 
                        <div id="encounterBox">
                            {this.state.monsters ? 
                                <div>
                                    {this.state.monsters.map(mon=>
                                    <div>
                                        <b>{mon.nickname} ~ {mon.data.monsterName}, CR {mon.data.CR}</b><hr/>
                                        <p>{mon.data.size}, {mon.data.alignment[0]} {mon.data.alignment[1]},  
                                        {mon.data.monsterType}</p>
                                        <p>
                                            STR: {mon.data.stats.str.base} / + {mon.data.stats.str.bonus}<br/>
                                            DEX: {mon.data.stats.dex.base} / + {mon.data.stats.dex.bonus}<br/>
                                            CON: {mon.data.stats.con.base} / + {mon.data.stats.con.bonus}<br/>
                                            INT: {mon.data.stats.int.base} / + {mon.data.stats.int.bonus}<br/>
                                            WIS: {mon.data.stats.wis.base} / + {mon.data.stats.wis.bonus}<br/>
                                            CHA: {mon.data.stats.cha.base} / + {mon.data.stats.cha.bonus}<br/>
                                        </p>
                                    </div>)}
                                </div>
                            :<div id="encounterBox">Loading</div>}
                        </div>
                    :<i></i>}
                </div>
            </div>
            :<div>
                {this.state.campaign ? 
                    <div id="mainBox">
                        <div id="innerBox">
                            <h3>{this.state.campaign.campaignName} ~ {this.state.campaign.activeModule}</h3>
                            {this.state.module ?
                                <b>
                                    For levels {this.state.module.levels.from} - {this.state.module.levels.to}<br/>
                                </b>
                            :<i>Error!</i>}
                            <b>by {this.state.campaign.GM}</b><br/>
                        </div><hr/>
                        <div>
                            {this.state.campaign.PCs[0] ? 
                                <div id="innerBox">
                                    <b>Featuring following player characters;</b><hr/>
                                    {this.state.campaign.PCs.map(pc=>
                                    <i>
                                        {pc}
                                    </i>)}
                                <br/></div>
                            :<i></i>}
                            {this.state.campaign.NPCs[0] ? 
                                <div id="innerBox">
                                    <b>Featuring following non-player characters;</b><hr/>
                                    {this.state.campaign.NPCs.map(npc=>
                                    <i>
                                        {npc}
                                    </i>)}
                                <br/></div>
                            :<i></i>}
                            {this.state.module ?
                                <div><hr/>
                                    {this.state.module.encounters.map(enc=>
                                    <div id="innerBox">
                                        <b>{enc.encounterName} ~ </b>
                                            {enc.type.social ? 
                                                <div style={{display:"inline"}}>
                                                    <b>social</b><hr/>
                                                    {enc.npc[0] ?
                                                        <i>
                                                            {enc.npc.map(npc=>
                                                            <i>
                                                                {npc}
                                                            </i>)}
                                                        </i>
                                                    :<i></i>}<br/>
                                                    <button value={enc.encounterName} onClick={this.activateEncounter}>
                                                        Activate {enc.encounterName}
                                                    </button>
                                                </div>
                                            :<i></i>}
                                            {enc.type.skill ? 
                                                <div style={{display:"inline"}}>
                                                    <b>skill</b><hr/>
                                                    DC {enc.test.difficulty} {enc.test.skill} roll<br/>
                                                    <button value={enc.encounterName} onClick={this.activateEncounter}>
                                                        Activate {enc.encounterName}
                                                    </button>
                                                </div>
                                            :<i></i>}
                                            {enc.type.combat ? 
                                                <div style={{display:"inline"}}>
                                                    <b>combat</b><hr/>
                                                    {enc.monsters[0] ? 
                                                        <i>
                                                            {enc.monsters.map(mon=>
                                                            <i>
                                                                {mon.nickname} ~ {mon.monName}<br/>
                                                                {mon.alive ? <i>Alive</i>:<i>Dead</i>}
                                                            </i>)}
                                                        </i>
                                                    :<i></i>}<br/>
                                                    <button value={enc.encounterName} onClick={this.activateEncounter}>
                                                        Activate {enc.encounterName}
                                                    </button>
                                                </div>
                                            :<i></i>}
                                    </div>)}
                                </div>
                            :<i></i>}
                        </div>
                    </div>
                :<i></i>}<hr/>
                {this.state.events[0] ? 
                    <div>
                        <div id="msgBox">
                            {this.state.events.map(event => 
                            <b>
                                {event.msg ? 
                                    <div id="innerBox">{event.stamp}: {event.msg}</div>
                                :<i></i>}
                            </b>)}
                            <button className="bottomRight" onClick={this.clearEvents}>Clear events</button>
                        </div>
                    </div>
                :<i></i>}
            </div>}
            <hr/><div id="mainBox"><b>Roll a die;</b><br/>
                <input type="number" name="diceNum" onChange={this.change} required/>
                <select name="diceDie" onChange={this.change} required>
                    <option id="init"></option>
                    <option value="4">D4</option>
                    <option value="6">D6</option>
                    <option value="8">D8</option>
                    <option value="10">D10</option>
                    <option value="12">D12</option>
                    <option value="20">D20</option>
                </select>
                <button id="roller" onClick={this.roll}>Roll</button>
            </div>
        </div>)
    }
}

export default SessionPage