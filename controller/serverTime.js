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

exports.stamp = () =>
{
    const rawDate = new Date()
    const time = rawDate.getHours() + ':'
                + rawDate.getMinutes() + ':'
                + rawDate.getSeconds()
    return time
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
    return clock
}