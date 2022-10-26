const {model, Schema} = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    about: {
        type: String,
        maxLength: 500,
        required: true
    },

    profilePic: {
        type: String,
        default: '',
    },

    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
})

userSchema.pre('save', async function(){
    if (this.profilePic) return
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword;

    console.log(this.password, 'happens again');
    const random = Math.random()
    const randomIndex = Math.floor(random * 3)

    const ppArray = [
        `https://randomuser.me/api/portraits/men/${(randomIndex + 2) * 23}.jpg`,
        `https://randomuser.me/api/portraits/men/${(randomIndex + 1) * 25}.jpg`,
        `https://randomuser.me/api/portraits/men/${(randomIndex + 1) * 27}.jpg`,
    ]
    
    this.profilePic = ppArray[randomIndex]
})

userSchema.methods.comparePassword = async function(password){
    const samePassword = await bcrypt.compare(password, this.password)
    return samePassword
}

module.exports = model('user', userSchema)