import Socket from "socket.io-client"
const socket = Socket('http://localhost:3000')

const emitter = msg => 
{
    socket.emit(msg.event, msg.data)
}
socket.on('PM', msg =>
{
    const message = JSON.stringify(msg)
    window.localStorage.setItem('message', message)
})
socket.on('event', msg =>
{
    const event = JSON.stringify(msg)
    window.localStorage.setItem('event', event)
})
socket.on('broadcastGet', msg =>
{
    alert(msg + ' logged in!')
})

export default { emitter }