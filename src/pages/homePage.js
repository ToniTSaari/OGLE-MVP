import React from 'react'
import requestService from '../services/requestService'
import {BrowserRouter as Router, Link} from 'react-router-dom'

class HomePage extends React.Component
{
  constructor(props)
  {
    super(props)
    this.state = {value: ''}
    this.state = {characters: []}
    var data = {url:"/findAcc", content:{email:window.localStorage.getItem('email')}}
    requestService.poster(data).then((res) => 
    {
      this.setState({email:res.email}, () => 
      {
        window.localStorage.setItem('email', res.email)
      })
      this.setState({user:res.playerName}, () => 
      {
        window.localStorage.setItem('user', res.playerName)
      })
    })
    data = {url:"/listChar", content:{email:window.localStorage.getItem('email')}}
    requestService.poster(data).then((res) =>
    {
      if(res[0])
      {
        this.setState({index:res[0].index}, () =>
        {
          const characters = []
          const index = res[0].index
          for(var i = 1; index >= i; i++)
          {
            characters.push(
              {
                charName:res[i].character,
                race:res[i].race,
                stats:res[i].stats,
                Class:res[i].Class,
                saving:res[i].saving
              })
          }
          this.setState({characters:characters})
        })
      }
    })
  }
  render()
  {
    return(
      <div className="main">
       Logged in as: {this.state.email}
      {this.state.user ? <div> With name: {this.state.user}</div>:<div> anonymously</div>}
      <hr/>
      {this.state.characters ?
        <div>
        <Link to="/PCCreate">Create character</Link>
      </div>:<div><Link to="/PCCreate">Create new character</Link></div>}
      {this.state.characters.map((character)=>
      (
      <div><hr/><b>{character.charName}</b> a 
      level {character.Class.level} {character.race} {character.Class.Class}
          <table>
            <thead>
              <tr>
                <th>Strenght</th>
                <th>Dexterity</th>
                <th>Constitution</th>
                <th>Intelligence</th>
                <th>Wisdom</th>
                <th>Charisma</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{character.stats.str.base}</td>
                <td>{character.stats.dex.base}</td>
                <td>{character.stats.con.base}</td>
                <td>{character.stats.int.base}</td>
                <td>{character.stats.wis.base}</td>
                <td>{character.stats.cha.base}</td>
              </tr>
              <tr>
                <td>{character.stats.str.bonus}</td>
                <td>{character.stats.dex.bonus}</td>
                <td>{character.stats.con.bonus}</td>
                <td>{character.stats.int.bonus}</td>
                <td>{character.stats.wis.bonus}</td>
                <td>{character.stats.cha.bonus}</td>
              </tr>
            </tbody>
          </table>
        {character.saving ? 
          <div>
            <b>Saving throws: </b>
            {character.saving.str ? <i>Strenght </i>:<i></i>}
            {character.saving.dex ? <i>Dexterity </i>:<i></i>}
            {character.saving.con ? <i>Constitution </i>:<i></i>}
            {character.saving.int ? <i>Intelligence </i>:<i></i>}
            {character.saving.wis ? <i>Wisdom </i>:<i></i>}
            {character.saving.cha ? <i>Charisma </i>:<i></i>}
          </div>
          :<div></div>
        }
        </div>
      ))}
    </div>
    )
  }
}

export default HomePage