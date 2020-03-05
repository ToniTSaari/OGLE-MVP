import React from 'react'
import requestService from '../services/requestService'

class FriendsList extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {value:''}

        this.submit = this.submit.bind(this)
        this.request = this.request.bind(this)
        const data = {url:"/findAcc", content:{email:window.localStorage.getItem('email')}}
        requestService.poster(data).then((res)=>
        {
            this.setState({user:res.email,id:res._id})
        })
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
        const data = {url:"/findAcc", content:{email:this.state.friendMail}}
        requestService.poster(data).then((res) =>
        {
            this.setState({friendName:res.playerName,friend:res.email,friendID:res._id})
        })
    }
    request = async (event) =>
    {
        const data =
        {
            url:"/friendReq", content:
            {
                requester:this.state.user,
                requesterID:this.state.id,
                requestee:this.state.friend,
                requesteeID:this.state.friendID
            }
        }
        requestService.poster(data)
    }
    render()
    {
        return(
            <div className="main">
                <b><p>{this.state.user} is searching friends by email {this.state.friendMail}:</p></b>
                <form onSubmit={this.submit}>
                    <input type="text" name="friendMail" onChange={this.change} required></input>
                    <input type="submit" value="Find" />
                </form>
                {this.state.friend ? 
                <div id="mainBox">
                    {this.state.friend.friendName ? <b>{this.state.friend.friendName}</b>:<b></b>}
                    <b>{this.state.friend}</b><br/>
                    <button value={this.state.id} onClick={this.request}>Send friend request</button>
                </div>
                :<div></div>}
            </div>
        )
    }
}

export default FriendsList