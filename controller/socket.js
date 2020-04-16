const serverTime = require('./serverTime')

exports.socket = (io) =>
{
    io.on('connection', socket =>
    {
        const time = serverTime.time()
        console.log('User connection recieved on: ' + time)
        socket.on('disconnect', () => 
        {
            console.log('User disconnect! Attempting reconnect!')
        })
        socket.on('connect_timeout', () => console.log('User timed-out!'))
        socket.on('connect_error', (error) => console.log(error))
        socket.on('getClock', (interval) => 
        {
            console.log('Clock started with refresh interval of ' + interval + ' milliseconds.')
            setInterval(()=>
            {
                const time = serverTime.clock()
                socket.emit('clock', time)
            },interval)
        })
        socket.on('getTime', ()=>
        {
            console.log('sending timestamp: ' + time)
            socket.emit('time', time)
        })
        socket.on('getStamp', ()=>
        {
            const stamp = serverTime.stamp()
            console.log('sending timestamp: ' + stamp)
            socket.emit('stamp', stamp)
        })
        socket.on('broadcastSend', msg =>
        {
            io.sockets.emit('broadcastGet', msg)
        })
        socket.on('room', (msg) =>
        {
            console.log('A "'+ msg.event + '" namespace message "' + msg.data.time + ': ' 
                        + msg.data.msg + '" from ' + msg.sender + ' to "' + msg.room + '" recieved on ' + time)
            io.in(msg.room).emit(msg.event, msg.data, msg.sender)
        })
        socket.on('followback', (data) =>
        {
            console.log('Followback message to ' + data.room + ' by ' + data.sender + ' sent.')
            io.in(data.room).emit(data.event, "recieved", data.sender)
        })
        socket.on('session', (data) =>
        {
            const room = data
            const msg = "Connection to " + room
            const report = {msg:msg, time:time}
            console.log('Joining room "' + room + '" on ' + time)
            socket.join(room)
            io.in(room).emit('event', report, 'server')
        })
        socket.on('login', (data) =>
        {
            const room = data
            console.log('User ' + room + ' joined private room on ' + time)
            socket.join(room)
        })
    })
}