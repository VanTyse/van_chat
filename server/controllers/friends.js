const User = require('../models/User')
const mongoose = require('mongoose')


const createFriend = async (req, res) => {
    const {id} = req.user
    const {friendId} = req.query

    try{
        const user = await User.findOne({_id: id})
        const friend = await User.findOne({_id: friendId})
        if (!user || !friend) return res.status(500).json({msg: "something went wrong"})

        if (user.friends.includes(friendId) || friend.friends.includes(id)) 
        return res.status(400).json({msg: 'Already friends'})

        user.friends.push(friendId)
        friend.friends.push(id)
        await user.save()
        await friend.save()

        return res.status(200).json({msg: 'friend created successfully', user, friend})
    }
    catch (err) {
        res.status(500).json({msg: err.message})
    }



}

const getFriend = async (req, res) => {
    const {id} = req.user;
    const {id: friendId} = req.params

    try{
        const user = await User.findOne({_id: id})
        const friend = await User.findOne({_id: friendId})
        if (!user || !friend) return res.status(500).json({msg: "something went wrong"})
        if (!user.friends.includes(friendId) || !friend.friends.includes(id)) 
        return res.status(400).json({msg: 'Not friends'})

        return res.status(200).json({msg: 'friend found', friend})

    } catch (err){
        res.status(500).json({msg: err.message})
    }
}

const getFriends = async (req, res) => {
    const {id} = req.user;
    const {getMutualFriends, friendId} = req.query
    console.log(getMutualFriends, friendId);

    try{
        let friends;
        if (getMutualFriends && friendId) {
            console.log('jjj')
            friends = await User.find({friends: {$all : [id, friendId]}})
        }
        else 
        friends = await User.find({}).where('friends').in([id])
        
        return res.status(200).json({msg: 'successful', friends})
    } catch (err) {
        res.status(500).json({msg: err.message})
        
    }
}

const deleteFriend = async (req, res) => {
    const {id} = req.user;
    const {id: friendId} = req.params

    try{
        const user = await User.findOne({_id: id})
        const friend = await User.findOne({_id: friendId})
        if (!user || !friend) return res.status(500).json({msg: "something went wrong"})
        if (!user.friends.includes(friendId) || !friend.friends.includes(id)) 
        return res.status(400).json({msg: 'Not friends'})

        const updatedUser = await User.updateOne(
            {_id: id}, 
            {$pull : {friends: friendId}}
        )

        const updatedFriend = await User.updateOne(
            {_id: friendId}, 
            {$pull : {friends: id}},
            {new: true}
        )

        return res.status(200).json({updatedUser, updatedFriend})

    } catch (err){
        res.status(500).json({msg: err.message})
    }
}

module.exports = {deleteFriend, getFriend, getFriends, createFriend}