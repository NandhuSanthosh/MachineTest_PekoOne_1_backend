const { Server } = require("socket.io");
const chatModel = require("../model/chatModel")

const io = new Server(3001, {
    cors: {
        origin: '*'
    }
})


function applyHandler(){
    io.on("connection", (socket) => {
        socket.emit("welcome", 'welcome to this channel')
    
        socket.on("authenticate", (data)=> {
            if(data){
                console.log("UserId:", data)
                socket.join(data)
            }
        })

        socket.on("join-chat", data => {
            console.log("join chat one")
            socket.join(data)
        }) 

        socket.on("new-message", async (data) => {
            // socket.emit(data._id, data)

            const chatDoc = await chatModel.findById(data.to);

            socket.to(data.to).emit('new-message', data)
            chatDoc.participants.map( participant => {
                console.log("Participant: ", participant.userId.toString())
                socket.to(participant.userId.toString()).emit('new-message', data)
            })
        })
    })
}


module.exports = applyHandler