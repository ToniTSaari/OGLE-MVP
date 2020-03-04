import React from 'react'
import requestService from '../services/requestService'

class LoginForm extends React.Component
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
    const url = '/login'
    const player = {email: this.state.email, password:this.state.password}
    const data = {url:url, content:player}
    try
    {
      await requestService.poster(data).then((res)=>
      {
        window.localStorage.setItem('user', res.playerName)
        window.localStorage.setItem('email', res.email)
        window.location.href = '/'
      })
    }
    catch
    {
      alert('Login failed!')
      window.localStorage.clear('email')
      window.localStorage.clear('user')
      window.localStorage.clear('character')
      window.location.href = '/signup'
    }
  }
  render()
  {
    return(
      <div>
        <form onSubmit={this.submit}>
          <h3>Login with {this.state.email}</h3>
          <label>
            E-mail:<br/>
            <input type="text" name="email" onChange={this.change} /><br/>
          </label>
          <label>
            Password:<br/>
            <input type="password" name="password" onChange={this.change} /><br/>
          </label>
          <input class="button" type="submit" value="Login"/>
        </form>
        <br />
    </div>)
  }
}

export default LoginForm