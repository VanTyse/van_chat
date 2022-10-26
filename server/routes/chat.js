const { Router } = require('express')
const {getChats, createChat} = require('../controllers/chat')
const router = Router()
const authMiddleware = require('../middleware/auth')

router.route('/').get(authMiddleware, getChats).post(authMiddleware, createChat)

module.exports = router