const Chat = require('../models/Chat')


const createChat = async (req, res) => {
    const {id: userId} = req.user
    const {type} = req.body
    const {personId} = req.query
    const members = [userId, personId]
    
    try {
        const newChat = await Chat.create({members, type})
        return res.status(200).json({msg: 'successful', newChat})
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

const getChats = async (req, res) => {
    const {id: userId} = req.user
    try {
        const chats = await Chat.find({}).where('members').in([userId])
        return res.status(200).json({msg: 'successful', chats})
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

module.exports = {createChat, getChats}