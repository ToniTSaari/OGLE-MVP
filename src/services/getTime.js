import Socket from "socket.io-client"
const sock = Socket('http://localhost:3000')

function timer(back)
{
    sock.on('time', time => back(null, time))
    sock.emit('getTime', 1000)
}

export default timer