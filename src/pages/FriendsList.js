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
            this.setState({friend:res.playerName,id:res._id})
        })
    }
    request = async (event) =>
    {
        const toFriend =
        {
            url:"/upAcc",
            content:
            {
                id:this.state.id,
                update:
                {
                    friendRequestGot:
                    {
                        friend:window.localStorage.getItem('email'),
                        ID:window.localStorage.getItem('id')
                    }
                }
            }
        }
        const toYou = 
        {
            url:"/upAcc",
            content:
            {
                id:window.localStorage.getItem('id'),
                update:
                {
                    friendRequestSent:
                    {
                        friend:this.state.friendMail,
                        ID:this.state.id
                    }
                }
            }
        }
        requestService.poster(toFriend).then(
            requestService.poster(toYou)
        )
    }
    render()
    {
        return(
            <div className="main">
                {this.state.friend ? 
                <div id="mainBox">
                    <b>{this.state.friend}</b><br/>
                    <button value={this.state.id} onClick={this.request}>Send friend request</button>
                </div>
                :
                <div>
                    Search friends by email:
                    <form onSubmit={this.submit}>
                        <input type="text" name="friendMail" onChange={this.change} required></input>
                        <input type="submit" value="Find" />
                    </form>
                </div>}
            </div>
        )
    }
}

export default FriendsList