const Message = require('../models/Message')
const Chat = require('../models/Chat');

const getMessage = async (req, res) => {
    const {id} = req.params;
    const message = await Message.findOne({id})

    if (!message) return res.status(401).json({err: 'no message'})
    return res.status(200).json(message)
}

const getMessages = async (chatId) => {
    const messages = await Message.find({chatId})
    console.log(messages)
    if (!messages) return {err: 'No Messages'}
    return {messages}
}

const createMessage = async ({text, chatId, from, to}) => {
    const chat = await Chat.findOne({_id: chatId})
    console.log(`text is ${text}`)
    let newMessage;

    if (chat.type === 'group') {
        if ( !text || !chatId || !from ) return {msg: 'incomplete fields'}
        newMessage = await Message.create({text, chatId, from});

        chat.lastMessage = {
            date: Date.now(),
            text
        }

        await chat.save()
    }

    if (chat.type === 'regular') {
        if ( !text || !chatId || !from || !to ) return {msg: 'incomplete fields'}
        newMessage = await Message.create({text, chatId, from, to});

        chat.lastMessage = {
            date: Date.now(),
            text
        }

        await chat.save()
    }

    return { newMessage }
}

const messageSocketHandler = (socket) => {
    socket.on('get-messages', async (chatId) => {
        const {messages} = await getMessages(chatId)

        socket.join(chatId)
        socket.emit('load-messages', messages)

        socket.on('send-message', async (chatId, message, from, to) => {
            console.log(message)
            const newMessage = await createMessage({text: message, chatId, from, to})
            socket.broadcast.to(chatId).emit('receive-message', newMessage)
        })
    })
}


module.exports = {createMessage, getMessage, getMessages, messageSocketHandler}