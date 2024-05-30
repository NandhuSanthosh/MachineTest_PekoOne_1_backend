require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require("cookie-parser");


const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes')
const { cloudinaryConfig } = require('./configs/cloudinary');
const mongoConfig = require('./configs/mongo');
const { errorHandler } = require('./middleware/errorMiddleware');
const {parser} = require('./middleware/authMiddleware');
const applyHandler = require('./socket');

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'http://test.nandhu.shop', "https://test.nandhu.shop"], 
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json()); 
app.use(cookieParser());
app.use(parser)

app.use('/', userRouter)
app.use('/chat', chatRouter)
app.use(errorHandler)


applyHandler()
cloudinaryConfig()
mongoConfig().then( (res) => {
    console.log("mongodb connected")
})
.catch( (err) => {
    console.log(err.message)
})

app.listen( process.env.PORT,    () => {
    console.log("server running on ", process.env.PORT)
})