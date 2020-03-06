import React from 'react'
import requestService from '../services/requestService'
import rollService from '../services/rollService'

class Campaign extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {value:''}

        this.change = this.change.bind(this)
        this.submit = this.submit.bind(this)
        this.roller = this.roller.bind(this)
        this.modCampaign = this.modCampaign.bind(this)

        const data = {url:"/findAcc", content:{email:window.localStorage.getItem('email')}}
        requestService.poster(data).then((res)=>
        {
            this.setState({email:res.email})
            if(res[0]){this.setState({campaign:res.campaigns})}
            if(res.playerName){this.setState({user:res.playerName})}else{this.setState({user:"Anon"})}
        })
    }
    modCampaign(event)
    {
        alert('nothing yet')
    }
    roller()
    {
        const die = rollService(1,20)
        this.setState({roll:die})
    }
    change = (event) => {
        let nam = event.target.name
        let val = event.target.value
    
        this.setState({[nam]:val})
    
        window.localStorage.setItem('class', this.state.class)
        window.localStorage.setItem('race', this.state.race)
    }
    submit = (event) =>
    {
        const campaign = {url:"/makeCamp", content:{GM:this.state.email, campaignName:this.state.campaignName}}
        requestService.poster(campaign).then(()=>
        {
            //const data = {url}
            //requestService.poster(data).then(window.location.reload())
            
        })
    }
    render()
    {
        return(
            <div className="main">
                {this.state.user ? 
                <div>
                    Hello, {this.state.user}<br/>{this.state.campaignName}
                    
                    {this.state.campaign ?
                        <button className="bigInput">Modify Campaign</button>:
                        <form onSubmit={this.submit}>
                            <input type="text" name="campaignName" className="bigInput" onChange={this.change}/>
                            <input type="submit" value="New Campaign" id="button" className="bigInput"/>
                        </form>}
                    </div>:<i></i>}
                <button onClick={this.roller}>Roll</button>
                {this.state.roll ? <i>{this.state.roll}</i>:<i></i>}
            </div>
        )
    }
}

export default Campaign