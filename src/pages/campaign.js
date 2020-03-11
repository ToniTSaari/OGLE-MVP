import React from 'react'
import {BrowserRouter as Router, Link} from 'react-router-dom'
import requestService from '../services/requestService'

class Campaign extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {value:''}

        this.change = this.change.bind(this)
        this.submit = this.submit.bind(this)
        this.invite = this.invite.bind(this)
        this.back = this.back.bind(this)
        this.modCampaign = this.modCampaign.bind(this)

        const data = {url:"/findAcc", content:{email:window.localStorage.getItem('email')}}
        requestService.poster(data).then((res)=>
        {
            this.setState({email:res.email,id:res._id,friends:res.friends})
            if(res.campaigns[0]){this.setState({campaigns:res.campaigns})}
            if(res.playerName){this.setState({user:res.playerName})}else{this.setState({user:"Anon"})}
        })
    }
    modCampaign = async (event) =>
    {
        this.setState({thisCampaign:event.target.value})
        window.localStorage.setItem('campaign', event.target.value)
        var invChar
        const invited = []
        await requestService.poster({url:"/findCampaign", content:{campaignName:event.target.value}}).then((res)=>
        { 
            invChar = res.characters
        })
        const invLen = invChar.length
        for(var i = 0; i < invLen; i++)
        {
            await requestService.poster({url:"/findChar", content:{charName:invChar[i]}}).then((res)=>
            {
                invited.push(res.playerCharacter.email)
            })
        }
        const buddies = []
        const friends = this.state.friends
        const len = friends.length
        for(i = 0; i < len; i++)
        {
            const characters = []
            const friend = friends[i]
            const data = {email:friend}
            await requestService.poster({url:"/listChar", content:data}).then((res)=>
            {
                if(res[0])
                {
                    const index = res[0].index
                    for(var i = 1; i <= index; i++)
                    {
                        if(!res[i].campaign)
                        {
                            characters.push(res[i])
                        }
                    }
                }
            })
            if(characters[0])
            {
                buddies.push({characters})
            }
        }
        this.setState({invChar})
        this.setState({buddies})
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
            const data = {url:"/pushPlayer",content:{id:this.state.id,campaign:this.state.campaignName}}
            requestService.poster(data).then(window.location.reload())
        })
    }
    invite = (event) =>
    {
        var name
        var ID
        requestService.poster({url:"/findChar", content:{charName:event.target.value}}).then((res)=>
        {
            name = res.charName
            ID = res._id
        })
        requestService.poster({url:"/findCampaign", content:{campaignName:this.state.thisCampaign}}).then((res)=>
        {
            var newChar = false
            const characters = res.characters
            const pLen = characters.length
            for(var i = 0; i <= pLen; i++)
            {
                if(res.characters[i] !== name)
                {
                    newChar = true
                }
                else
                {
                    newChar = false
                    break
                }
            }
            if(newChar)
            {
                characters.push(name)
            }
            const data = 
            {
                id:res._id,
                characters:characters,
                GM:res.GM,
                campaignName:res.campaignName,
                monsters:res.monsters
            }
            alert(JSON.stringify(data))
            requestService.poster({url:"/pushCamp", content:data}).then((res)=>
            {
                window.location.reload()
            })
            const charData =
            {
                campaign:this.state.thisCampaign,
                id:ID
            }
            requestService.poster({url:"/pushChar", content:charData})
        })
    }
    back()
    {
        this.setState({thisCampaign:undefined, invited:undefined, invChar:undefined, buddies:undefined})
        window.localStorage.clear('campaign')
        window.localStorage.setItem('email', this.state.email)
        window.localStorage.setItem('user', this.state.user)
    }
    render()
    {
        return(
            <div className="main">
                {this.state.user ? 
                <div>
                    <b>Hello, {this.state.user}, {this.state.email}</b><br/>
                    {this.state.campaigns ?
                        <i>
                            {this.state.campaigns.map((campaign)=>
                            <button id="button" value={campaign} className="bigInput" onClick={this.modCampaign}>
                                {campaign}
                            </button>)}
                        </i>:<i></i>}
                        {this.state.thisCampaign ? 
                            <b>
                                <button id="button" className="bigInput" onClick={this.back}>New</button><hr/>
                                <Link to="/session">~ Start session of {this.state.thisCampaign} ~</Link><br/><hr/>
                                
                            </b>:
                            <div><hr/>
                                {this.state.campaignName ? <p><b>New Campaign: </b><i>{this.state.campaignName}</i></p>:<i></i>}
                                <form onSubmit={this.submit}>
                                    <input type="text" name="campaignName" className="bigInput" onChange={this.change} required/>
                                    <input type="submit" value="New Campaign" id="button" className="bigInput"/>
                                </form>
                            </div>}
                    </div>:<i></i>}
                {this.state.invChar ? 
                    <div id="mainBox">
                        <br/><b>{this.state.thisCampaign}</b> has following characters;<br/>
                        {this.state.invChar.map((char)=><i className="main">{char} </i>)}
                    </div>
                :<i></i>}
                {this.state.buddies ? 
                    <div id="mainBox">
                       <b>Friends that can be invited to campaign;</b><br/>
                        {this.state.buddies.map((friend)=>
                            <div>
                                <i className="main">{friend.friend}</i><br/>
                                {friend.characters.map((char)=><i>
                                    <hr/>{char.character} a level {char.Class.level} {char.race} {char.Class.Class} of {char.player} ~
                                    <button id="button" style={{float:"right"}} value={char.character} onClick={this.invite}>Invite to {this.state.thisCampaign}</button>
                                </i>)}
                            </div>)}
                    </div>
                :<i></i>}
            </div>
        )
    }
}

export default Campaign