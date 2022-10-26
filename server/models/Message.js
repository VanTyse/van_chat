const {model, Schema} = require('mongoose')

const messageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },

    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    chatID: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }
}, {timestamps: true})

module.exports = model('Message', messageSchema)