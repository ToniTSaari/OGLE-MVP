import React from 'react'
import requestService from '../services/requestService'
import socketService from '../services/socketService'
import rollService from '../services/rollService'
import Socket from "socket.io-client"

const sock = Socket('http://localhost:3000',
{
    reconnection:true,
    reconnectionAttempts:100,
    reconnectionDelay:1000,
    reconnectionDelayMax: 5000
})

class SessionPage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {value:''}
        this.state = {events:[]}

        this.change = this.change.bind(this)
        this.submit = this.submit.bind(this)
        this.roll = this.roll.bind(this)

    }
    componentWillMount()
    {
        const user = window.localStorage.getItem('user')
        requestService.poster({url:"/findAcc", content:{playerName:user}}).then(res=>
        {
            const campaign = res.activeCampaign
            this.setState({GM:res})
            requestService.poster({url:"/findCampaign", content:{campaignName:campaign}}).then(res=>
            {
                const modu = res.activeModule
                this.setState({room:modu})
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
                })
            })
        })
    }
    componentDidUpdate()
    {
        setInterval(()=>
        {
            if(this.state.latest !== window.localStorage.getItem('event'))
            {
                const event = window.localStorage.getItem('event')
                this.setState({latest:event})
                const events = this.state.events
                events.push(event)
                this.setState({events})
            }
        },3000)
    }
    change = (event) => {
        let nam = event.target.name
        let val = event.target.value
        this.setState({[nam]:val})
    }
    roll()
    {
        const die = this.state.diceDie
        const num = this.state.diceNum
        const roll = rollService(num, die)
        const msg = this.state.diceNum + 'D'+ this.state.diceDie + ' = ' + roll
        socketService.emitter({event:"room", data:{event:"event", data:msg, room:this.state.room}})
    }
    submit = async (event) =>
    {
        
    }
    render()
    {
        return(
        <div>
            {this.state.GM ? 
            <p>
                {this.state.GM.playerName}<br/>
                {this.state.campaign ? <i>{this.state.campaign.campaignName}</i>:<i></i>} ~ 
                {this.state.module ?
                <i>
                    {this.state.module.moduleName}
                    {this.state.module.encounters.map((enc)=>
                    <p>
                        {enc.encounterName}
                    </p>)}
                </i>
                :<i></i>}
            </p>
            :<i></i>}
            <hr/>
            {this.state.events[0] ? 
                <p><hr/>
                    {this.state.events.map(event => 
                    <i>
                        {event}
                    </i>)}
                </p>
            :<i></i>}
            Roll a die;
            <div>
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
                <button onClick={this.roll}>Roll</button>
            </div>
        </div>)
    }
}

export default SessionPage