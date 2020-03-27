import Socket from "socket.io-client"
const sock = Socket('http://localhost:3000')

const timer = res =>
{
    sock.on('time', time => res(null, time))
    sock.emit('getTime', 500)
}

export default timer