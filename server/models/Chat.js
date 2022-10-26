const {model, Schema} = require('mongoose')

const chatSchema = new Schema({
    members: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    },

    type: {
        type: String,
        enum: ['group', 'regular']
    }
})

module.exports = model('Chat', chatSchema)