const serverTime = require('./serverTime')

exports.socket = (io) =>
{
    io.on('connection', socket =>
    {
        const time = serverTime.time()
        console.log('User connection recieved on: ' + time)
        socket.on('disconnect', () => console.log('User disconnect!'))
        socket.on('connect_timeout', () => console.log('User timed-out!'))
        socket.on('connect_error', (error) => console.log(error))
        socket.on('getTime', (interval) => 
        {
            console.log('Clock started with refresh interval of ' + interval + ' milliseconds.')
            setInterval(()=>
            {
                const time = serverTime.clock()
                socket.emit('time', time)
            },interval)
        })
        socket.on('broadcastSend', msg =>
        {
            io.sockets.emit('broadcastGet', msg)
        })
        socket.on('room', (msg) =>
        {
            console.log('Message to ' + msg.room + ' recieved on ' + time)
            console.log(msg.event)
            console.log(msg.data)
            io.in(msg.room).emit(msg.event, msg.data)
        })
        socket.on('session', (data) =>
        {
            const room = data
            console.log('Starting session of ' + room + ' on ' + time)
            socket.join(room)
        })
        socket.on('login', (data) =>
        {
            const room = data
            console.log('User ' + room + ' joined private room on ' + time)
            socket.join(room)
        })
    })
}