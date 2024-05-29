const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "userModel"
    }, 
    to: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "chatModel"
    },
    readby: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "userModel"
        }, 
        readAt: {
            type: Date
        }
    }],
    time: {
        type: Date, 
        default: new Date()
    }, 
    text: {
        type: String
    }
})

const messageModel = mongoose.model('messageModel', messageSchema)
module.exports = messageModel
        