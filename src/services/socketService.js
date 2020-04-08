import Socket from "socket.io-client"
const socket = Socket('http://localhost:3000',
{
    reconnection:true,
    reconnectionAttempts:100,
    reconnectionDelay:1000,
    reconnectionDelayMax: 5000
})
const emitter = msg => 
{
    socket.emit(msg.event, msg.data)
}
socket.on('connect', () =>
{
    console.log('Connected')
})
socket.on('disconnect', () =>
{
    console.log('Disconnected')
})
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
socket.connect()

export default { emitter }