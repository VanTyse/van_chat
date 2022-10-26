const User = require('../models/User');
const JWT =  require('jsonwebtoken');


const loginController = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    
    if (!user){
        return res.status(401).json({msg: 'invalid email or password'})
    }
    
    const {name} = user

    const isPassword = await user.comparePassword(password)
    console.log(isPassword);

    if (!isPassword) return res.status(401).json({msg: 'invalid email or password'})
    

    const token = JWT.sign({name, id: user.id}, process.env.JWT_SECRET)

    return res.status(200).json({msg:'success', token, user})

}

const registerController = async (req, res) => {
    const {email, password, name, about} = req.body;
    const user = await User.findOne({email})

    if (user){
        return res.status(401).json({msg: 'email already exists'})
    }

    const newUser = await User.create({email, name, password, about})
    return res.status(200).json({msg: 'sucessful', newUser})
}

module.exports = {loginController, registerController}