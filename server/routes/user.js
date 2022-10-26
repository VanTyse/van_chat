const {Router} = require('express')
const {getUsers, getSingleUser} = require('../controllers/user')
const authMiddleware = require('../middleware/auth')

const router = Router()

router.route('/').get(authMiddleware, getUsers)
router.route('/:id').get(getSingleUser)


module.exports = router