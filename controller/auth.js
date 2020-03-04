const player = require('../schema/player');
const crypt = require('bcryptjs')

const rawDate = new Date()
const date = rawDate.getHours() + ':'
            + rawDate.getMinutes() + ':'
            + rawDate.getSeconds() + ':'
            + rawDate.getMilliseconds() + ' - '
            + rawDate.getDate() + '.'
            + rawDate.getMonth() + '.'
            + rawDate.getFullYear()

const salty = async (password) => 
{
  const sodiumAmount = 10
  password = await crypt.hash(password, sodiumAmount)
  return password
}

exports.login = async (req, res) =>
{
  let obj = req.body
  var search = player.where({email:obj.email});
  search.findOne(function(err, find)
  {
    if(err){console.log(err)}
    if(find)
    {
      const correctPass = crypt.compareSync(obj.password, find.password)
      find.password = "It's a secret ;)"
      console.log(find)
      if(correctPass)
      {
        console.log('Moro ' + find.email + ' - ' + date)
        res.json(find)
      }
      else
      {
        console.log('Login Failed! - ' + date)
        res.redirect(401, "/login")
      }
    }
    else
    {
      console.log('Tuntematon käyttäjä! - ' + date)
      res.redirect(401, "/signup")
    }
  })
}

exports.signup = async (req,res) =>
{
  let obj = req.body
  console.log(obj)
  obj.password = await salty(obj.password)
  var playa = new player(obj)
  var search = player.where({email:obj.email});
  await search.findOne(function(err, find)
  {
    if(!find)
    {
      const saved = playa.save()
      console.log('Player ' + saved.email + ' created on ' + date)
      res.sendStatus(201)
    }
  })
}