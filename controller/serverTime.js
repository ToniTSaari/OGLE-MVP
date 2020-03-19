exports.time = () =>
{
    const rawDate = new Date()
    const date = rawDate.getDate() + '.'
                + (rawDate.getMonth() + 1) + '.'
                + rawDate.getFullYear()+ ' --- '
                + rawDate.getHours() + ':'
                + rawDate.getMinutes() + ':'
                + rawDate.getSeconds()

    console.log('Sending time: ' + date)
    return date
}

exports.clock = () =>
{
    const rawDate = new Date()
    const date = rawDate.getDate() + '.'
                + (rawDate.getMonth() + 1) + '.'
                + rawDate.getFullYear()

    const time = rawDate.getHours() + ':'
                + rawDate.getMinutes() + ':'
                + rawDate.getSeconds()

    const clock = {date:date, time:time}
    //console.log('Sending json: ' + JSON.stringify(clock))
    return clock
}