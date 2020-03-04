import React from 'react'
import requestService from '../services/requestService'

class SignUpForm extends React.Component
{
  constructor(props)
  {
    super(props)
    this.state = {value:''}

    this.change = this.change.bind(this)
    this.submit = this.submit.bind(this)
  }
  change = (event) => {
    let nam = event.target.name
    let val = event.target.value
    this.setState({[nam]:val})
  }
  submit = async (event) =>
  {
    event.preventDefault()
    const player = 
    {
        playerName: this.state.name, email:this.state.email, password:this.state.password
    }
    const url = '/signup'
    const data = {url:url, content:player}
    try
    {
      requestService.poster(data).then((res) =>
      {
        window.localStorage.setItem('email', player.email)
        window.location.href = '/'
      })
    }
    catch
    {
      alert('Signup failed!')
      window.localStorage.clear()
      window.location.href = '/'
    }
  }
  render()
  {
    return(
      <div>
        <form onSubmit={this.submit}>
          <h3>Sign up as {this.state.name} with Email {this.state.email}</h3>
          <label>
            Name:<br/>
            <input type="text" name="name" onChange={this.change} /><br/>
          </label>
          <label>
            E-Mail:<br/>
            <input type="text" name="email" onChange={this.change} required/><br/>
          </label>
          <label>
            Password:<br/>
            <input type="password" name="password" onChange={this.change} required/><br/>
          </label>
          <input class="button" type="submit" value="Sign Up"/>
        </form>
        <br />
    </div>)
  }
}

export default SignUpForm