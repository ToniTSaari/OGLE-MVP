import React from 'react'
import requestService from '../services/requestService'

class Session extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {value:''}

        const data = {url:"/findCampaign", content:{campaignName:window.localStorage.getItem('campaign')}}
        requestService.poster(data).then((res)=>
        {
            this.setState({campaign:res.campaignName,characters:res.characters,GM:res.GM})
        })
    }
    render()
    {
        return(
            <div>
                {this.state.campaign ? 
                    <p>
                        {this.state.campaign} by {this.state.GM} with characters;<br/>
                        {this.state.characters.map((char)=><i>{char}</i>)}
                    </p>
                :<p></p>}
            </div>
        )
    }
}

export default Session