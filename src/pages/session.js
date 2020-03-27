import React from 'react'
import requestService from '../services/requestService'
import socketService from '../services/socketService'

class SessionPage extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {value:''}
        this.state = {events:[]}

        this.change = this.change.bind(this)
        this.submit = this.submit.bind(this)

        
    }
    componentDidMount()
    {
        const session =
        {
            event:'session',
            data:this.state.module
        }
        socketService.emitter(session)
        setInterval(()=>
        {
            const events = this.state.events
            const event = JSON.parse(window.localStorage.getItem('event'))
            events.push(event)
            this.setState({events:events})
        },1000)
    }
    change = (event) => {
        let nam = event.target.name
        let val = event.target.value
        this.setState({[nam]:val})
    }
    submit = async (event) =>
    {
        
    }
    render()
    {
        return(
        <div>
            Roll a die;
            <div>
                <form onSubmit={this.roll}>
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
                <button type="submit">Roll</button>
                </form>
            </div><hr/>
        </div>)
    }
}

export default SessionPage