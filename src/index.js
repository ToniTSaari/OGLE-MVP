import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom'
import License from './pages/license'
import LoginForm from './pages/LoginForm'
import SignUpForm from './pages/SignUpForm'
import DeleteForm from './pages/DeleteForm'
import UpdateForm from './pages/UpdateForm'
import PCCreateForm from './pages/PCCreateForm'
import PCCreateFormNew from './pages/PCCreateFormNew'
import HomePage from './pages/homePage'
import FriendsList from './pages/FriendsList'
import Campaign from './pages/campaign'
import ModuleBuilder from './pages/ModuleBuilder'
import NPC from './pages/NPCCreateForm'
import GMS from './pages/GMSession'
import PCS from './pages/PCSession'
import Clock from './services/getTime'
import './style/pages.scss'

class Time extends React.Component 
{
  constructor(props)
  {
    super(props)
    this.state = {clock:undefined}
    Clock.clock((clock)=>
    {
      this.setState({clock})
    })
  }
  render()
  {
    return(
      <b>
        {this.state.clock ? 
          <b>
            {this.state.clock.time} - {this.state.clock.date}
          </b>
        :<i></i>}
      </b>
    )
  }
}

const Home = () =>
(
  <div><HomePage /></div>
)

const LicensePage = () =>
(
  <div><License /></div>
)

const Login = () => 
(
  <div><LoginForm /></div>
)

const Update = () => 
(
  <div><UpdateForm /></div>
)

const Logout = () => 
{
  window.localStorage.clear('*')
  window.location.href = '/'
}

const PCCreate = () => 
(
  <div><PCCreateFormNew /></div>
)

const Friends = () =>
(
  <div><FriendsList /></div>
)

const Delete = () => 
(
  <div><DeleteForm /></div>
)

const SignUp = () => 
(
  <div><SignUpForm /></div>
)

const App = () =>
{
  const email = window.localStorage.getItem('email')
  return(
  <div>
    <nav>
      <Router >
        <div className="mainControl"><div id="clock"></div>
          {email ?
            <div className="navbar">
              <Link to="/">~ Home ~</Link>  
              <Link to="/upAcc">~ Update account ~</Link>
              <Link to="/logOut">~ LogOut ~</Link> 
              <Link to="/del">~ Delete account ~</Link> 
              <Link to="/friends">~ Friends List ~</Link>
              <Link to="/license">~ License ~</Link>
            </div>:
            <div className="navbar">
              <Link to="/login">~ Login ~</Link> 
              <Link to="/signUp">~ Sign Up ~</Link>
              <Link to="/license">~ License ~</Link> 
            </div>}
        </div>
        <Route exact path="/" render={() => email ? <Home /> : <Redirect to="/login"/>}/>
        <Route exact path="/license" render={() => <LicensePage />} />
        <Route exact path="/login" render={() => <Login />} />
        <Route exact path="/upAcc" render={() => <Update />} />
        <Route exact path="/signUp" render={() => <SignUp />} />
        <Route exact path="/logOut" render={() => <Logout />} />
        <Route exact path="/del" render={() => <Delete />} />
        <Route exact path="/friends" render={() => <Friends />} />
        <Route exact path="/PCCreate" render={() => <PCCreate />} />
        <Route exact path="/campaign" render={() => <Campaign/>} />
        <Route exact path="/ModuleBuilder" render={() => <ModuleBuilder/>} />
        <Route exact path="/NPC" render={() => <NPC/>}/>
        <Route exact path="/PCSession" render={() => <PCS/>}/>
        <Route exact path="/GMSession" render={() => <GMS/>}/>
      </Router>
    </nav>
  </div>)
}
ReactDOM.render(<App />, document.getElementById('root'))
ReactDOM.render(<Time />, document.getElementById('clock'))