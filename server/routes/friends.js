const {Router} = require('express')
const authMiddleware = require('../middleware/auth');
const {createFriend, deleteFriend, getFriend, getFriends} = require('../controllers/friends')

const router = Router()

router.route('/').post(authMiddleware, createFriend).get(authMiddleware, getFriends)
router.route('/:id').get(authMiddleware, getFriend).delete(authMiddleware, deleteFriend)

module.exports = router 