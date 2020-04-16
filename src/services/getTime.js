import Socket from "socket.io-client"
const sock = Socket('http://localhost:3000')

const clock = res =>
{
    sock.on('clock', time => res(time))
    sock.emit('getClock', 500)
}

const timer = res =>
{
    sock.emit('getTime')
    sock.on('time', time => res(time))
}

const stamp = res =>
{
    sock.emit('getStamp')
    sock.on('stamp', time => res(time))
}

export default { clock, timer, stamp}