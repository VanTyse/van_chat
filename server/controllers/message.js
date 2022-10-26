const Message = require('../models/Message')
const Chat = require('../models/Chat');

const getMessage = async (req, res) => {
    const {id} = req.params;
    const message = await Message.findOne({id})

    if (!message) return res.status(401).json({err: 'no message'})
    return res.status(200).json(message)
}

const getMessages = async (req, res) => {
    const {chatOwner, recipient, chatID} = req.query
    const messages = await Message.find({chatID})

    if (!messages) return res.status(401).json({err: 'no message'})
    return res.status(200).json(messages)
}

const createMessage = async (req, res) => {
    const { text, chatID, from, to } = req.body
    const {type} = await Chat.findOne({_id: chatID})
    
    let newMessage;

    if (type === 'group') {
        if ( !text || !chatID || !from ) return res.status(400).json({err: 'incomplete fields'})
        newMessage = await Message.create({text, chatID, from});
    }

    if (type === 'regular') {
        if ( !text || !chatID || !from || !to ) return res.status(400).json({err: 'incomplete fields'})
        newMessage = await Message.create({text, chatID, from, to});
    }

    return res.status(200).json({msg: 'success', newMessage})
}


module.exports = {createMessage, getMessage, getMessages}