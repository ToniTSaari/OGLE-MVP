import React from 'react'
import requestService from '../services/requestService'
import socketService from '../services/socketService'

class FriendsList extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {value:''}

        this.submit = this.submit.bind(this)
        this.request = this.request.bind(this)
        if(!window.localStorage.getItem('email'))
        {
            window.location.href = "/"
        }
        const content = {email:window.localStorage.getItem('email')}
        const data = {url:"/findAcc", content:content}
        this.friendApprove = this.friendApprove.bind(this)
        this.friendDisapprove = this.friendDisapprove.bind(this)
        this.PM = this.PM.bind(this)
        requestService.poster(data).then((res)=>
        {
            const sock = 
            {
                data:res.playerName,
                event:"login"
            }
            socketService.emitter(sock)
            this.setState({user:res.playerName,id:res._id})
            if(res.friends[0]){this.setState({friends:res.friends})}
        })
        requestService.poster({url:"/listGot", content}).then((res)=>
        {
            if(res[0]){this.setState({gotReqs:res})}
        })
        requestService.poster({url:"/listSent", content}).then((res)=>
        {
            if(res[0]){this.setState({sentReqs:res})}
        })
        
    }
    componentDidMount()
    {
        setInterval(()=>
        {
            const message = JSON.parse(window.localStorage.getItem('message'))
            this.setState({message:message})
        },5000)
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
            this.setState({friend:res.playerName,friendEmail:res.email,friendID:res._id})
        })
    }
    request = async () =>
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
    friendApprove = (event) =>
    {
        const friend =
        {
            url:"/appFriend",
            content:
            {
                reqID:event.target.value
            }
        }
        requestService.poster(friend)
        window.location.reload()
    }
    friendDisapprove = (event) =>
    {
        const friend =
        {
            url:"/decFriend",
            content:
            {
                reqID:event.target.value
            }
        }
        requestService.poster(friend)
        window.location.reload()
    }
    PM(event)
    {
        const message = 
        {
            event:'room',
            data:
            {
                room:event.target.PMfriend.value,
                event:'PM',
                data:
                {
                    sender:this.state.user,
                    text:this.state.PM
                }
            }
        }
        socketService.emitter(message)
    }
    render()
    {
        return(
            <div className="main">
                {this.state.message ? <i>{this.state.message.sender}: {this.state.message.text}</i>:<i>No MSG</i>}
                <b><p>{this.state.user} is searching friends by email {this.state.friendMail}:</p></b>
                <form onSubmit={this.submit}>
                    <input type="text" name="friendMail" onChange={this.change} required></input>
                    <input type="submit" value="Find" />
                </form>
                {this.state.friend ? 
                    <div id="mainBox">
                        {this.state.friend.friend ? <b>{this.state.friend.friend}</b>:<b></b>}
                        <b>{this.state.friend}</b><br/>
                        <button value={this.state.id} onClick={this.request}>Send friend request</button>
                    </div>
                :<div></div>}
                <hr/>
                {this.state.friends ? 
                    <div>
                        <b>Friends with; </b><br/>
                        {this.state.friends.map((friend)=>
                            <div id="friendBox">
                                <b>{friend}</b><br/>
                                Send private message<br/>
                                <form onSubmit={this.PM}>
                                    <input type="hidden" value={friend} name="PMfriend"/>
                                    <input type="text" name="PM" onChange={this.change}/>
                                    <input type="submit" value="Send"/>
                                </form>
                            </div>
                        )}
                    </div>
                :<div></div>}
                <hr/>
                {this.state.gotReqs ? 
                    <div>
                        <b>You have recieved the following friend requests;</b>
                        {this.state.gotReqs.map((friend)=>
                            <div>
                                {friend.requester ? <div id="friendBox">{friend.requester}
                                <button value={friend.reqID} onClick={this.friendApprove}>
                                    Accept request
                                </button>
                                <button value={friend.reqID} onClick={this.friendDisapprove}>
                                    Decline request
                                </button><br/></div>:<i></i>}
                            </div>
                        )}
                        <hr/>
                    </div>
                :<div></div>}
                {this.state.sentReqs ?
                    <div>
                        <b>You have sent the following friend requests;</b>
                        {this.state.sentReqs.map((friend)=>
                            <div>
                                {friend.requestee ? <div id="friendBox"><b>{friend.requestee}</b><br/>
                                <button value={friend.reqID} onClick={this.friendDisapprove}>
                                    Cancel request
                                </button></div>:<i></i>}
                            </div>
                        )}
                        <hr/>
                    </div>
                :<div></div>}
            </div>
        )
    }
}

export default FriendsList