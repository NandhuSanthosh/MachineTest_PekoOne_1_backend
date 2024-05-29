const mongoose = require('mongoose')

function mongoConfig(){
    return mongoose.connect(process.env.MONGO_URL)
}

module.exports = mongoConfig