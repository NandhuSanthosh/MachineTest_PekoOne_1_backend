const { NotFoundError } = require("../middleware/errorMiddleware");
const chatModel = require("../model/chatModel");
const userModel = require("../model/userModel");
const messageModel = require("../model/messageModel")


// to fetch one on one chat by using user id
module.exports.get_chat_from_userId = async function(req, res, next) {
    try {
        const { userId } = req.query;
        console.log(userId)

        const date = new Date()

        const previousChat = await chatModel.findOne({"participants.userId": {$all: [userId, req.user.id]}})
        if(previousChat) {
            console.log("previous chat was there")
            res.send(previousChat)
        }
        else {
            const newChatDocDetails = {
                participants: [{
                    userId: req.user.id, 
                    lastRead: date 
                }, {
                    userId: userId, 
                    lastRead: date
                }], 
                isGroup: false, 
                scope: "private"
            }
            
            const newChat = await chatModel.create(newChatDocDetails)
            res.send(newChat)
        }

    } catch (error) {
        next(error)
    }
}

// fetching chat details along with recent messages
module.exports.fetch_chats_details = async function(req, res, next) {
    try {
        let {chatId, isGroup} = req.query;
        const date = new Date();

        const chatDoc = await chatModel.findById(chatId)
        .populate("participants.userId"); 


        if(!chatDoc) 
            throw new NotFoundError("Can't find chat!")


        const messages = await messageModel.find({to: chatId}).sort({time: 1}).limit(50)


        let userLastReadTime = chatDoc.participants.filter(x => {
            return x.userId._id == req.user.id
        })[0]
        console.log(userLastReadTime)


        // updating message readby
        const updateMessageReadyBy = await messageModel.updateMany(
            {to: chatId, time: {$lte: date, $gte: userLastReadTime.lastRead}}, 
            {$addToSet: {readby: {userId: req.user.id, reatAt: date}}})

        // updating chat lastread
        userLastReadTime.lastRead = date; 
        chatDoc.save();


        chatDoc.messages = messages

        const result = {
            messages, 
            participants: chatDoc.participants, 
            _id: chatDoc._id, 
            isGroup: chatDoc.isGroup, 
            name: chatDoc.name, 
            scope: chatDoc.scope
        }
        
        res.send(result)

    } catch (error) {
        next(error)
    }
}

// sending message both one-on-one and group
module.exports.send_message = async function(req, res, next){
    try {
        const {text, chatId } = req.body;
        const userId = req.user.id
        
        const chatDoc = await chatModel.findById(chatId);
        if(!chatDoc)
        throw new NotFoundError("Chat not found!")
    
        const date = new Date()

        const newMessageDoc = await messageModel.create({
            from: userId, 
            to: chatDoc._id, 
            readby: [{
                userId: userId, 
                readAt: date
            }], 
            time: date, 
            text: text
        })

        chatDoc.lastMessaage = newMessageDoc._id;
        chatDoc.save();

        res.send(newMessageDoc)

    } catch (error) {
        next(error)
    }
}

// create group
module.exports.create_group = async function(req, res, next) {
    try {
       const {name, isPrivate, participants} = req.body;
        const date = new Date()

       const groupParticipants = [...participants, req.user.id].map( participant => {
        return {
            userId: participant, 
            lastRead: date
        }
       })
       
       const newGroupDetails = {
            participants: groupParticipants, 
            isGroup: true, 
            name: name, 
            isStarted: true, 
            scope: isPrivate ? "private": "public"
       }

       const newGroupDoc = await chatModel.create(newGroupDetails)
       res.send(newGroupDoc)
    } catch (error) {
        next(error)
    }
}