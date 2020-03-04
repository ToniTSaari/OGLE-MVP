const bonus = stat =>
{
    const bonus = 
    [
        -20, -5, -4, -4, -3, -3, -2, -2, -1, -1, 0, 0, 
        1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10
    ]

    return bonus[stat]
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

const buy = stat =>
{
    var buy = 1
    if(stat >= 13){ buy = 2 }
    return buy
}

const sell = stat =>
{
    var sell = 1
    if(stat >= 14){ sell = 2 }
    return sell
}

export default { bonus, reset, buy, sell }