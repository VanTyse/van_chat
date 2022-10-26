const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const {createServer} = require('http')

const authRoutes = require('./routes/auth')
const messageRoutes = require('./routes/message')
const userRoutes = require('./routes/user')
const friendRoutes = require('./routes/friends')
const chatRoutes = require('./routes/chat')

const server = createServer(app);

app.use(express.json())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/message', messageRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/friend', friendRoutes)
app.use('/api/v1/chat', chatRoutes)

const {Server} = require('socket.io');

const io = new Server(server, {
    cors : {
        origin: `http://localhost:3000`,
        methods: ['GET', 'POST']
    }
})

mongoose.connect(process.env.MONGO_URI).then(console.log('db connected'))

io.on('connection', (socket) => {

})


const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
    console.log(`server connected to port ${PORT}`)
})


