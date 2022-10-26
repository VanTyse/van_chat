const { Router } = require('express')
const { getMessage, createMessage, getMessages } = require('../controllers/message')

const router = Router()

router.route('/').post(createMessage).get(getMessages)
router.route('/:id').get(getMessage)

module.exports = router