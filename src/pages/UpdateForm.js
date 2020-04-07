import React from 'react'
import requestService from '../services/requestService'

class UpdateForm extends React.Component
{
  constructor(props)
  {
    super(props)
    this.state = {value:''}

    this.change = this.change.bind(this)
    this.submit = this.submit.bind(this)
    const url = "/findAcc"
    if(!window.localStorage.getItem('email'))
    {
        window.location.href = "/"
    }
    const data = {url:url, content:{email:window.localStorage.getItem('email')}}
    requestService.poster(data).then((res) => 
    {
      this.setState({user:res.playerName,email:res.email, id:res._id})
    })
  }
  change = (event) => {
    let nam = event.target.name
    let val = event.target.value
    this.setState({[nam]:val})
  }
  submit = async (event) =>
  {
    event.preventDefault()
    const update = 
    {
      playerName:this.state.user,
      email:this.state.email
    }
    const url = '/upAcc'
    const data = {url:url, content:{id:this.state.id,update:update}}
    await requestService.poster(data).then(
      window.location.href = "/"
    )
  }
  render()
  {
    return(
      <div>
        <form onSubmit={this.submit}>
          <h3>
            Change Email to {this.state.email} and name to {this.state.user}
          </h3>
          <label>
            Name:<br/>
            <input type="text" name="user" value={this.state.user} onChange={this.change}/><br/>
          </label>
          <label>
            E-Mail:<br/>
            <input type="text" name="email" value={this.state.email} onChange={this.change} required/><br/>
          </label>
          <input class="button" type="submit" value="Save"/>
        </form>
        <br />
    </div>)
  }
}

export default UpdateForm