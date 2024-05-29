const { isProtected } = require('../middleware/authMiddleware');
const {fetch_chats_details, send_message, get_chat_from_userId, create_group} = require("../controllers/chatController")


const Router = require('express').Router; 
const router = Router();



// fetch message in a chat
router.get('/', isProtected, fetch_chats_details)

// fetch chat from userid
router.get('/chat_userId', isProtected, get_chat_from_userId)

// send message to a chat
router.post('/sent', isProtected, send_message)


router.post('/create_group', isProtected, create_group)



module.exports = router;