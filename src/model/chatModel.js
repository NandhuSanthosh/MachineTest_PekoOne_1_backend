const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "userModel"
        }, 
        lastRead: {
            type: Date
        }
    }], 
    lastMessaage: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "messageModel"
    },
    isGroup: {
        type: Boolean, 
        default: false
    }, 
    name: {
        type: String, 
        default: null
    }, 
    isStarted: {
        type: Boolean, 
        deafult: false
    },
    scope: {
        type: String, 
        enum : ["private", "public"], 
        default: "private"
    }
})

const chatModel = mongoose.model('chatModel', chatSchema)
module.exports = chatModel
        