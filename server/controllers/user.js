const User = require('../models/User')

const getUsers = async (req, res) => {
    const {id} = req.user
    try {
        const users = await User.find({_id: {$ne : id}})
        return res.status(200).json({msg: 'success', users})
    } catch (error) {
        return res.status(500).json({msg: 'Something went wrong', err: error.message})
    }
}

const getSingleUser = async (req, res) => {
    const {id} = req.params

    try {
        const user = await User.findOne({_id: id})
        return res.status(200).json({msg: 'success', user})
    } catch (error) {
        return res.status(500).json({msg: 'Something went wrong', err: error.message})
    }

}


module.exports = {getSingleUser, getUsers}