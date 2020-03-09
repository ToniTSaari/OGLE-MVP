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
        this.modCampaign = this.modCampaign.bind(this)

        const data = {url:"/findAcc", content:{email:window.localStorage.getItem('email')}}
        requestService.poster(data).then((res)=>
        {
            this.setState({email:res.email,id:res._id,buddies:res.friends})
            if(res.campaigns[0]){this.setState({campaigns:res.campaigns})}
            if(res.playerName){this.setState({user:res.playerName})}else{this.setState({user:"Anon"})}
        })
    }
    modCampaign = async (event) =>
    {
        const buddies = []
        const friends = this.state.buddies
        const len = friends.length
        for(var i = 0; i < len; i++)
        {
            const friend = friends[i]
            const data = {playerCharacter:{PC:true, email:friends[i]}}
            await requestService.poster({url:"/findChar", content:data}).then((res)=>
            {
                if(res[1])
                {
                    const len = res.length
                    for(var i = 0; i < len; i++)
                    {
                        buddies.push({friend:friend,characters:res[i]})
                    }
                }
                else
                {
                    buddies.push({friend:friend,characters:res})
                }
            })
            this.setState({buddies})
        }
        alert(JSON.stringify(this.state.buddies))
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
        requestService.getter({url:"/listChar"})
        const campaign = {url:"/makeCamp", content:{GM:this.state.email, campaignName:this.state.campaignName}}
        await requestService.poster(campaign).then((res)  =>
        {
            alert(JSON.stringify(res))
            alert('pitäs toimii')
            const data = {url:"/pushPlayer",content:{id:this.state.id,campaign:this.state.campaignName}}
            requestService.poster(data).then(window.location.reload())
        })
    }
    render()
    {
        return(
            <div className="main">
                {this.state.user ? 
                <div>
                    <b>Hello, {this.state.user}</b><br/>{this.state.campaignName}
                    {this.state.campaigns ?
                        <div>
                            {this.state.campaigns.map((campaign)=>
                            <button id="button" className="bigInput" onClick={this.modCampaign}>
                                Modify {campaign}
                            </button>)}
                        <hr/></div>:<i></i>}
                        <form onSubmit={this.submit}>
                            <input type="text" name="campaignName" className="bigInput" onChange={this.change}/>
                            <input type="submit" value="New Campaign" id="button" className="bigInput"/>
                        </form>
                    </div>:<i></i>}
            </div>
        )
    }
}

export default Campaign