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
    this.charDel = this.charDel.bind(this)
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
      this.setState({id:res._id})
    })
    const content = {email:window.localStorage.getItem('email')}
    requestService.poster({url:"/listGot", content}).then((res)=>
    {
      if(res[0]){this.setState({gotReqs:res})}
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
                id:res[i].id,
                charName:res[i].character,
                race:res[i].race,
                stats:res[i].stats,
                Class:res[i].Class,
                saving:res[i].saving,
                armour:res[i].armour,
                campaign:res[i].campaign
              })
          }
          this.setState({characters:characters})
        })
      }
    })
  }
  charDel = (event) =>
  {
    alert(event.target.value)
    const del = {url:"/delChar", content:{_id:event.target.value}}
    requestService.poster(del).then(window.location.reload())
  }
  render()
  {
    return(
      <div className="main">
       Logged in as: {this.state.email}
      {this.state.user ? <div> With name: {this.state.user}</div>:<div> anonymously</div>}
      <hr/>{this.state.gotReqs ? <div>New friend request! Check Friends List!<hr/></div>:<i></i>}
      <Link to="/Campaign">~ Campaign ~</Link>
      {this.state.characters ?
        <div>
        <Link to="/PCCreate">~ Create new character ~</Link>
      <hr/></div>:<div><Link to="/PCCreate">~ Create character ~</Link><hr/></div>}<br/>
      {this.state.characters.map((character)=>
      (
      <div id="mainBox"><b>{character.charName}</b> a 
      level {character.Class.level} {character.race} {character.Class.Class}. {character.campaign ? <i>In campaign: {character.campaign}</i>:<i></i>}
      <button id="delButton" style={{float:"right"}} value={character.id} onClick={this.charDel}>Delete {character.charName}</button>
          <table>
            <thead>
              <tr>
                <th>Strength</th>
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
            {character.saving.str ? <i>Strength </i>:<i></i>}
            {character.saving.dex ? <i>Dexterity </i>:<i></i>}
            {character.saving.con ? <i>Constitution </i>:<i></i>}
            {character.saving.int ? <i>Intelligence </i>:<i></i>}
            {character.saving.wis ? <i>Wisdom </i>:<i></i>}
            {character.saving.cha ? <i>Charisma </i>:<i></i>}
          </div>
          :<div></div>
        }
          <div>
            <b>Armour: </b>{character.armour}
          </div>
        </div>
      ))}
    </div>
    )
  }
}

export default HomePage