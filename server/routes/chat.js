const { Router } = require('express')
const {getChats, createChat, getChat} = require('../controllers/chat')
const router = Router()
const authMiddleware = require('../middleware/auth')

router.route('/').get(authMiddleware, getChats).post(authMiddleware, createChat)
router.route('/:id').get(authMiddleware, getChat)

module.exports = router