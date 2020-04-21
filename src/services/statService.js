const bonus = stat =>
{
    const bonus = Math.floor((stat - 10) / 2)
    return bonus
}

const reset = () =>
{
    const stat =
    {
        str:{base:10, total:10, bonus:0, race:0},
        con:{base:10, total:10, bonus:0, race:0},
        dex:{base:10, total:10, bonus:0, race:0},
        int:{base:10, total:10, bonus:0, race:0},
        wis:{base:10, total:10, bonus:0, race:0},
        cha:{base:10, total:10, bonus:0, race:0}
    }
    return stat
}

const buy = (stat, ABImp) =>
{
    var buy = 1
    if(stat >= 13 && !ABImp){ buy = 2 }
    return buy
}

const sell = (stat, ABImp) =>
{
    var sell = 1
    if(stat >= 14 && !ABImp){ sell = 2 }
    return sell
}

export default { bonus, reset, buy, sell }