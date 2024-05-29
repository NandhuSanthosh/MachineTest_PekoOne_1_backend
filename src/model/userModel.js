const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String, 
        required: true
    }, 
    email: {
        type: String, 
        required: true
    }, 
    profilePicture: {
        type: String, 
        default: null
    },
    password: {
        type: String, 
        required: true
    },
    isOnline: {
        type: Boolean, 
        deafult: false
    },
    pinned: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'chatModel'
    }]
})

const userModel = mongoose.model('userModel', userSchema)
module.exports = userModel
        