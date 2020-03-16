import statService from './statService'

const modPlus = (stats, point, plus) => 
{
  const max = 15
  var buy = 0
  switch (plus)
  {
    case "str":
      buy = statService.buy(stats.str.base)
      if(stats.str.base >= max)
      {
        document.getElementById("strPlus").disabled = true
        document.getElementById("strMinus").disabled = false
        stats.str.base = max
        stats.str.total = stats.str.base + stats.str.race
        break
      }

      if(point > 0 && point >= buy)
      {
        document.getElementById("strMinus").disabled = false
        stats.str.total += 1
        stats.str.base = stats.str.total - stats.str.race
        point -= buy
      }
      break;
    case "dex":
      buy = statService.buy(stats.dex.base)
      if(stats.dex.base >= max)
      {
        document.getElementById("dexPlus").disabled = true
        document.getElementById("dexMinus").disabled = false
        stats.dex.base = max
        stats.dex.total = stats.dex.base + stats.dex.race
        break
      }
      
      if(point > 0 && point >= buy)
      {
        document.getElementById("dexMinus").disabled = false
        stats.dex.total += 1
        stats.dex.base = stats.dex.total - stats.dex.race
        point -= buy
      }
    break;
    case "con":
      buy = statService.buy(stats.con.base)
      if(stats.con.base >= max)
      {
        document.getElementById("conPlus").disabled = true
        document.getElementById("conMinus").disabled = false
        stats.con.base = max
        stats.con.total = stats.con.base + stats.con.race
        break
      }

      if(point > 0 && point >= buy)
      {
        document.getElementById("conMinus").disabled = false
        stats.con.total += 1
        stats.con.base = stats.con.total - stats.con.race
        point -= buy
      }
      break;
    case "int":
      buy = statService.buy(stats.int.base)
      if(stats.int.base >= max)
      {
        document.getElementById("intPlus").disabled = true
        document.getElementById("intMinus").disabled = false
        stats.int.base = max
        stats.int.total = stats.int.base + stats.int.race
        break
      }
      
      if(point > 0 && point >= buy)
      {
        document.getElementById("intMinus").disabled = false
        stats.int.total += 1
        stats.int.base = stats.int.total - stats.int.race
        point -= buy
      }
      break;
    case "wis":
      buy = statService.buy(stats.wis.base)
      if(stats.wis.base >= max)
      {
        document.getElementById("wisPlus").disabled = true
        document.getElementById("wisMinus").disabled = false
        stats.wis.base = max
        stats.wis.total = stats.wis.base + stats.wis.race
        break
      }

      if(point > 0 && point >= buy)
      {
        document.getElementById("wisMinus").disabled = false
        stats.wis.total += 1
        stats.wis.base = stats.wis.total - stats.wis.race
        point -= buy
      }
      break;
    case "cha":
      buy = statService.buy(stats.cha.base)
      if(stats.cha.base >= max)
      {
        document.getElementById("chaPlus").disabled = true
        document.getElementById("chaMinus").disabled = false
        stats.cha.base = max
        stats.cha.total = stats.cha.base + stats.cha.race
        break
      }

      if(point > 0 && point >= buy)
      {
        document.getElementById("chaMinus").disabled = false
        stats.cha.total += 1
        stats.cha.base = stats.cha.total - stats.cha.race
        point -= buy
      }
      break;
    default:
      break;
  }
  const mod = {stats:stats, point:point}
  return mod
}

const modMinus = (stats, point, minus) =>
{
  const min = 8
  switch (minus)
    {
      case "str":
        if(stats.str.base <= min)
        {
          document.getElementById("strPlus").disabled = false
          document.getElementById("strMinus").disabled = true
          stats.str.base = min
          stats.str.total = stats.str.base + stats.str.race
          break
        }

        if(point < 27)
        {
          document.getElementById("strPlus").disabled = false
          const buy = statService.sell(stats.str.base)
          stats.str.total -= 1
          stats.str.base = stats.str.total - stats.str.race
          point += buy
        }
        break;
      case "dex":
        if(stats.dex.base <= min)
        {
          document.getElementById("dexPlus").disabled = false
          document.getElementById("dexMinus").disabled = true
          stats.dex.base = min
          stats.dex.total = stats.dex.base + stats.dex.race
          break
        }

        if(point < 27)
        {
          document.getElementById("dexPlus").disabled = false
          const buy = statService.sell(stats.dex.base)
          stats.dex.total -= 1
          stats.dex.base = stats.dex.total - stats.dex.race
          point += buy
        }
      break;
      case "con":
        if(stats.con.base === min)
        {
          document.getElementById("conPlus").disabled = false
          document.getElementById("conMinus").disabled = true
          stats.con.base = min
          stats.con.total = stats.con.base + stats.con.race
          break
        }

        if(point < 27)
        {
          document.getElementById("conPlus").disabled = false
          const buy = statService.sell(stats.con.base)
          stats.con.total -= 1
          stats.con.base = stats.con.total - stats.con.race
          point += buy
        }
        break;
      case "int":
        if(stats.int.base === min)
        {
          document.getElementById("intPlus").disabled = false
          document.getElementById("intMinus").disabled = true
          stats.int.base = min
          stats.int.total = stats.int.base + stats.int.race
          break
        }

        if(point < 27)
        {
          document.getElementById("intPlus").disabled = false
          const buy = statService.sell(stats.int.base)
          stats.int.total -= 1
          stats.int.base = stats.int.total - stats.int.race
          point += buy
        }
        break;
      case "wis":
        if(stats.wis.base === min)
        {
          document.getElementById("wisPlus").disabled = false
          document.getElementById("wisMinus").disabled = true
          stats.wis.base = min
          stats.wis.total = stats.wis.base + stats.wis.race
          break
        }

        if(point < 27)
        {
          document.getElementById("wisPlus").disabled = false
          const buy = statService.sell(stats.wis.base)
          stats.wis.total -= 1
          stats.wis.base = stats.wis.total - stats.wis.race
          point += buy
        }
        break;
      case "cha":
        if(stats.cha.base === min)
        {
          document.getElementById("chaPlus").disabled = false
          document.getElementById("chaMinus").disabled = true
          stats.cha.base = min
          stats.cha.total = stats.cha.base + stats.cha.race
          break
        }

        if(point < 27)
        {
          document.getElementById("chaPlus").disabled = false
          const buy = statService.sell(stats.cha.base)
          stats.cha.total -= 1
          stats.cha.base = stats.cha.total - stats.cha.race
          point += buy
        }
        break;
      default:
        break;
    }
    const mod = {stats:stats, point:point}
    return mod
}

export default { modPlus, modMinus }