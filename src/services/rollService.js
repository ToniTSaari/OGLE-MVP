const roller = (num,dice) =>
{
    var roll = 0
    for(var i = 0; i < num; i++)
    {
        var die = Math.floor((Math.random() * dice) + 1);
        roll += die
    }
    return roll
}
export default roller