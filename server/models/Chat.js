const {model, Schema} = require('mongoose')

const chatSchema = new Schema({
    members: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },

    type: {
        type: String,
        enum: ['group', 'regular']
    },

    lastMessage: {
        text: {
            type: String,
            default: ''
        },

        date: {
            type: Schema.Types.Date,
            default: null
        }
    }
})

module.exports = model('Chat', chatSchema)