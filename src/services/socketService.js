import Socket from "socket.io-client"

const socket = Socket('http://localhost:3000',
{
    reconnection:true,
    reconnectionAttempts:9999,
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
    window.localStorage.setItem('message', msg)
})
socket.on('event', (data, sender)=>
{
    window.localStorage.setItem('event', data.msg)
    window.localStorage.setItem('stamp', data.time)
    window.localStorage.setItem('sender', sender)
    window.localStorage.setItem('followback', false)
})
socket.on('followback', (msg, sender) =>
{
    window.localStorage.setItem('sender', sender)
    window.localStorage.setItem('followback', true)
    setInterval(()=>{ document.getElementById('roller').disabled = false },3000)
    
})
socket.on('broadcastGet', msg =>
{
    alert(msg + ' logged in!')
})
socket.connect()

export default { emitter }