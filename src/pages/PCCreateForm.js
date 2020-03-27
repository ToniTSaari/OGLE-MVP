import React from 'react'
import requestService from '../services/requestService'
import statService from '../services/statService'
import statMod from '../services/statModService'
import lister from '../services/listService'

class PCCreateForm extends React.Component
{
  constructor(props)
  {
    super(props)
    //state initialization
    this.state = {value:''}
    this.state = {race:'Human'}
    this.state = {classes: []}
    this.state = {point:15}
    this.state = {level:1}
    this.state = {SR:false}
    this.state = {creation:1}

    //sub-app binding
    this.change = this.change.bind(this)
    this.race = this.race.bind(this)
    this.subrace = this.subrace.bind(this)
    this.Class = this.Class.bind(this)
    this.submit = this.submit.bind(this)
    this.plus = this.plus.bind(this)
    this.minus = this.minus.bind(this)
    this.levelUp = this.levelUp.bind(this)
    this.levelDown = this.levelDown.bind(this)
    this.backRace = this.backRace.bind(this)
    this.backClass = this.backClass.bind(this)

    //default character stats saved to state
    const defStats = statService.reset()    
    this.state = {stats:defStats}

    //finding user and setting user email as key
    const email = window.localStorage.getItem('email')
    const findUser = {url:"/findAcc", content:{email:email}}
    requestService.poster(findUser).then((res) => 
    {
      this.setState({email:res.email})
    })

    //fetching playable races from mongo and listing them
    requestService.getter({url:"/listRace"}).then((res)=>
    {
      if(res[0])
      {
        this.setState({index:res[0].index}, () =>
        {
          const raceList = []
          const index = this.state.index
          for(var i = 1; index >= i; i++)
          {
            raceList.push(
              {
                race:res[i].race,
                desc:res[i].desc
              })
          }
          this.setState({races:raceList})
          this.setState({point:15})
          this.setState({level:1})
        })
      }
    })

    //fetching classes from mongo and listing them
    requestService.getter({url:"/listClass"}).then((res) =>
    {
      if(res[0])
        {
          this.setState({index:res[0].index}, () =>
          {
            const classList = []
            const index = this.state.index
            for(var i = 1; index >= i; i++){classList.push({PCClass:res[i].Class})}
            this.setState({classes:classList})
          })
        }
    })
  }

  //vestigial change event, used for name only
  change = (event) => {
    let nam = event.target.name
    let val = event.target.value

    this.setState({[nam]:val})

    window.localStorage.setItem('class', this.state.class)
    window.localStorage.setItem('race', this.state.race)
  }

  race = (event) =>
  {
    //resetting stats to defaults before loading racial stat bonuses
    const defStats = statService.reset()
    this.setState({stats:defStats})

    this.setState({race:event.target.value}, () => 
    {
      this.setState({point:15})
      const findRace = {url:"/findRace", content:{raceName:this.state.race}}

      requestService.poster(findRace).then((res) => 
      {
        const str = this.state.stats.str.base + res.stats.str
        const dex = this.state.stats.dex.base + res.stats.dex
        const con = this.state.stats.con.base + res.stats.con
        const int = this.state.stats.int.base + res.stats.int
        const wis =  this.state.stats.wis.base + res.stats.wis
        const cha = this.state.stats.cha.base + res.stats.cha
        
        const stats =
        {
          str:{total:str, bonus:statService.bonus(str), race:res.stats.str},
          dex:{total:dex, bonus:statService.bonus(dex), race:res.stats.dex},
          con:{total:con, bonus:statService.bonus(con), race:res.stats.con},
          int:{total:int, bonus:statService.bonus(int), race:res.stats.int},
          wis:{total:wis, bonus:statService.bonus(wis), race:res.stats.wis},
          cha:{total:cha, bonus:statService.bonus(cha), race:res.stats.cha}
        }
        const racials = []

        const racLen = res.racials.length
        for(let i = 0; racLen >= i; i++)
          { racials.push( res.racials[i] ) }

        this.setState({stats:stats}, () =>
        {

          if(res.subraces[0].subName)
          {
            
            const subList = []
            const subLength = res.subraces.length

            for(let i = 0; subLength > i; i++)
            {
              subList.push(
              {
                subName:res.subraces[i].subName,
                subDesc:res.subraces[i].subDesc, 
                racials:res.subraces[i].racials,
                stats:res.subraces[i].stats,
                id:res.subraces[i]._id
              })
            }
            this.setState({racials:racials}, () =>
            {
              this.setState({subraces:subList})
            })
          }
          else{this.setState({subraces:undefined}, () => 
          {
            this.setState({racials:racials})
          })}
        })
      })
    })  
  }

  levelUp = (event) =>
  {
    document.getElementById("lvlDown").disabled = false
    var level = this.state.level
    level += 1
    if(level >= 20)
    {
      level = 20
      document.getElementById("lvlUp").disabled = true
      
    }
    this.setState({level:level})
  }

  levelDown = (event) =>
  {
    document.getElementById("lvlUp").disabled = false
    var level = this.state.level
    level -= 1
    if(level <= 1)
    {
      level = 1
      document.getElementById("lvlDown").disabled = true
    }
    this.setState({level:level})
  }

  subrace = (event) =>
  {
    var i = 0
    var subrace = []
    var stats = this.state.stats
    const subLength = this.state.subraces.length

    for(i = 0; subLength > i; i++)
    {
      if(this.state.subraces[i].id === event.target.value)
      {
        subrace = this.state.subraces[i]
      }
    }

    stats.str.race += subrace.stats.str
    stats.dex.race += subrace.stats.dex
    stats.con.race += subrace.stats.con
    stats.int.race += subrace.stats.int
    stats.wis.race += subrace.stats.wis
    stats.cha.race += subrace.stats.cha

    stats.str.total += subrace.stats.str
    stats.dex.total += subrace.stats.dex
    stats.con.total += subrace.stats.con
    stats.int.total += subrace.stats.int
    stats.wis.total += subrace.stats.wis
    stats.cha.total += subrace.stats.cha

    this.setState({stats:stats}, () =>
    {
      const racials = this.state.racials
      const subracials = subrace.racials

      const racLen = subracials.length
      for(i = 0; racLen >= i; i++)
        { racials.push( subracials[i] ) }
      
      this.setState({race:subrace.subName}, () =>
      {
        this.setState({racials:racials}, () =>
        {
          this.setState({SR:true})
        })
      })
    })
  }

  Class = (event) =>
  {
    this.setState({Class:event.target.value}, () =>
    {
      document.getElementById("lvlDown").disabled = true
      const findClass = {url:"/findClass", content:{className:this.state.Class}}

      requestService.poster(findClass).then((res)=> 
      {
        this.setState({tools:res.proficiencies.tools})
        this.setState({profBonus:res.leveling[this.state.level].proficiency})
        this.setState({saving:res.saving})

        if(res.proficiencies.armour[0])
        {
          this.setState( { armour:lister.allLister(res.proficiencies.armour) } )
        }
        else{ this.setState( { armour:["None"] } ) }

        //this.setState( { saving:lister(res.proficiencies.saving) } )
        this.setState( { weapons:lister.allLister(res.proficiencies.weapons) } )
        this.setState( { skills:lister.allLister(res.proficiencies.skills.skill) } )
        this.setState( { leveling:lister.allLister(res.leveling) } )
      })
    })
  }

  plus = (event) => 
  {
    this.setState({plus:event.target.value}, () =>
    {
      var stats = this.state.stats
      var point = this.state.point
      const mod = statMod.modPlus(stats,point,this.state.plus)
      stats = mod.stats
      point = mod.point
      this.setState({point:point}, () =>
      {
        this.setState({stats:stats})
      })
    })
  }

  minus = (event) =>
  {
    this.setState({minus:event.target.value}, () =>
    {
      var stats = this.state.stats
      var point = this.state.point
      const mod = statMod.modMinus(stats, point, this.state.minus)
      stats = mod.stats
      point = mod.point
      this.setState({point:point}, () =>
      {
        this.setState({stats:stats})
      })
    })
  }

  submit = async (event) =>
  {
    event.preventDefault()
    const stats = this.state.stats
    alert(JSON.stringify(stats))
    const character = 
    {
        playerCharacter:{PC:true, email:this.state.email},
        charName:this.state.charName,
        race:this.state.race,
        stats:
        {
          str:{base:stats.str.total, bonus:statService.bonus(stats.str.total)},
          dex:{base:stats.dex.total, bonus:statService.bonus(stats.dex.total)},
          con:{base:stats.con.total, bonus:statService.bonus(stats.con.total)},
          int:{base:stats.int.total, bonus:statService.bonus(stats.int.total)},
          wis:{base:stats.wis.total, bonus:statService.bonus(stats.wis.total)},
          cha:{base:stats.cha.total, bonus:statService.bonus(stats.cha.total)}
        },
        Classes:{Class:this.state.Class,level:this.state.level},
        proficiencies:
        {
          armour:this.state.armour,
          tools:this.state.tools,
          bonus:this.state.profBonus,
        },
        saving:this.state.saving
    }
    alert(JSON.stringify(character))
    const charData = {url:'/makePC', content:character}

    try
    {
      await requestService.poster(charData)
      window.location.href = "/"
    }
    catch
    {
      alert('Character creation failed!')
    }
  }
  backRace(){this.setState({race:undefined,SR:undefined,racials:undefined})}
  backClass(){this.setState({Class:undefined,armour:undefined,saving:undefined})}

  render()
  {
    return(
      <div>
        <h3>Account {this.state.email} creating; <br/> 
        {this.state.charName} a level {this.state.level} {this.state.race} {this.state.Class}</h3>

        {this.state.race ? 
          <div>

            {this.state.SR ? 
              <div></div>
              :
              <div>
                {this.state.subraces ? 
                  <div>
                    <button onClick={this.backRace}>Back</button><br/>
                    Select Subrace:
                    {this.state.subraces.map((sub)=>
                      (<div>{sub.subDesc}<br/><button value={sub.id} onClick={this.subrace}>{sub.subName}</button></div>)
                    )}
                    <hr/>
                  </div>:<div></div>}
              </div>}

          </div>
          :
          <div>

            {this.state.races ?
              <div>
                <br/>Select race:<br/>

                {this.state.races.map((race)=>
                  (<div><button value={race.race} onClick={this.race}>{race.race}</button> {race.desc}</div>)
                )}
              </div>:<div>Loading...</div>}

          </div>}

        {this.state.SR && this.state.race || this.state.race === "Human" ? 
          <div>
            {this.state.Class ? <div></div>:
            <div><button onClick={this.backRace}>Back</button><br/>
              {this.state.classes ?
              <div>
                Select class:<br/>

                {this.state.classes.map((Class)=>
                  (<button value={Class.PCClass} onClick={this.Class}>{Class.PCClass}</button>)
                )}

                <hr/>
              </div>:<div>Loading...</div>}
            </div>}
          </div>
        :<div></div>}

        {this.state.Class ?
          <div>
            
            <button onClick={this.backClass}>Back</button><br/>
            Points to invest into stats: {this.state.point}<br/>
            <div id="statblock">
              <span id="statBox">
                <b>Strenght:</b>
              </span>
              <span id="statBox"> 
                {this.state.stats.str.total} - <b>Bonus:</b> 
                {statService.bonus(this.state.stats.str.total)}
              </span>
              <span id="statBox">
                <button value="str" id="strPlus" onClick={this.plus}>+</button>
                <button value="str" id="strMinus" onClick={this.minus}>-</button>
              </span>
              <br/>

              <span id="statBox">
                <b>Dexterity:</b>
              </span>
              <span id="statBox"> 
                {this.state.stats.dex.total} - <b>Bonus:</b> 
                {statService.bonus(this.state.stats.dex.total)}
              </span>
              <span id="statBox">
                <button value="dex" id="dexPlus" onClick={this.plus}>+</button>
                <button value="dex" id="dexMinus" onClick={this.minus}>-</button>
              </span>
              <br/>

              <span id="statBox">
                <b>Constitution:</b>
              </span>
              <span id="statBox">
                {this.state.stats.con.total} - <b>Bonus:</b> 
                {statService.bonus(this.state.stats.con.total)}
              </span>
              <span id="statBox">
                <button value="con" id="conPlus" onClick={this.plus}>+</button>
                <button value="con" id="conMinus" onClick={this.minus}>-</button>
              </span>
              <br/>

              <span id="statBox">
                <b>Intelligence:</b>
              </span>
              <span id="statBox">
                {this.state.stats.int.total} - <b>Bonus:</b> 
                {statService.bonus(this.state.stats.int.total)}
              </span>
              <span id="statBox">
                <button value="int" id="intPlus" onClick={this.plus}>+</button>
                <button value="int" id="intMinus" onClick={this.minus}>-</button>
              </span>
              <br/>

              <span id="statBox">
                <b>Wisdom:</b>
              </span>
              <span id="statBox">
                {this.state.stats.wis.total} - <b>Bonus:</b> 
                {statService.bonus(this.state.stats.wis.total)}
              </span>
              <span id="statBox">
                <button value="wis" id="wisPlus" onClick={this.plus}>+</button>
                <button value="wis" id="wisMinus" onClick={this.minus}>-</button>
              </span>
              <br/>
              
              <span id="statBox">
                <b>Charisma:</b>
              </span>
              <span id="statBox">
                {this.state.stats.cha.total} - <b>Bonus:</b> 
                {statService.bonus(this.state.stats.cha.total)}
              </span>
              <span id="statBox">
                <button value="cha" id="chaPlus" onClick={this.plus}>+</button>
                <button value="cha" id="chaMinus" onClick={this.minus}>-</button>
              </span>
              <br/>
            </div>

            {this.state.profBonus ? 
            <div>Proficienciency bonus: {this.state.profBonus}<hr/></div>
            :<div></div>}

            <button onClick={this.levelUp} id="lvlUp">Level up</button>
            <button onClick={this.levelDown} id="lvlDown">Level down</button>
            
            {this.state.point <= 0 ? 
            
              <div>
                <hr/>
                <form onSubmit={this.submit}>
                    Character name:
                    <input type="text" name="charName" onChange={this.change} />
                    <input class="button" type="submit" value="Save"/>
                </form>
              </div>
            
            :<div></div>}

            <hr/>
          </div>
          
        :<div></div>}
        
          {this.state.armour ? 
          
            <div>
              <b>Armour: </b>
              {this.state.armour.map((arm) =>
                (
                  <i>{arm} </i>
                )
              )}
            </div>

            :<div></div>
          }

        {this.state.racials ? 
          
          <div>
            <b>Racials: </b>
            {this.state.racials.map((rac) =>
              (
                <i>{rac} </i>
              )
            )}<br/>
          </div>

        :<div></div>}

        {this.state.race ? 

          <div>
            <b>Racial stat bonuses: </b><br/>
            <b>Strenght:</b>{this.state.stats.str.race}, <b>Dexterity:</b>{this.state.stats.dex.race}, <b>Constitution:</b>{this.state.stats.con.race},<br/>
            <b>Intelligence:</b>{this.state.stats.int.race}, <b>Wisdom:</b>{this.state.stats.wis.race}, <b>Charisma:</b>{this.state.stats.cha.race}
          </div>

        :<div></div>}

        {this.state.saving ? 

          <div>
            <b>Saving throws: </b>
            {this.state.saving.str ? <i>Strenght </i>:<i></i>}
            {this.state.saving.dex ? <i>Dexterity </i>:<i></i>}
            {this.state.saving.con ? <i>Constitution </i>:<i></i>}
            {this.state.saving.int ? <i>Intelligence </i>:<i></i>}
            {this.state.saving.wis ? <i>Wisdom </i>:<i></i>}
            {this.state.saving.cha ? <i>Charisma </i>:<i></i>}
          </div>

        :<div></div>}

        {this.state.tools ? 

          <div>
            <b>Tools: </b>
            {this.state.tools}<hr/>
          </div>

        :<div></div>}

        <br />
    </div>)
  }
}

export default PCCreateForm