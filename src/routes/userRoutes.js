const { register, login, auth, get_user, get_user_chat, fetch_all_users } = require('../controllers/userController');
const multer = require('multer');
const { isProtected } = require('../middleware/authMiddleware');


const Router = require('express').Router; 
const router = Router();

const upload = multer({ dest: 'uploads/' })

// user register
router.post('/register', upload.single('image'), register)

// user login
router.post('/login', login)

// user auth
router.get('/auth', auth)

// search user
router.get('/get_user', isProtected,  get_user)

// fetch user
router.get('/fetch_all_users', isProtected, fetch_all_users)

router.get("/get_user_chat", isProtected, get_user_chat)


module.exports = router;