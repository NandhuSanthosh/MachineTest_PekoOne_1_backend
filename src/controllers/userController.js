const {upload_single_image} = require("../configs/cloudinary");
const { ConflictError, ValidationError, UnauthorizedError } = require("../middleware/errorMiddleware");
const chatModel = require("../model/chatModel");
const userModel = require("../model/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function createToken(userDetails, id) {
    return jwt.sign(
      {
        userDetails,
        id,
      },
      process.env.JWT_KEY
    );
  }

module.exports.register = async(req, res, next) => {
    // console.log(req.file, req.body)

    try {
        let imageUrl; 
        if(req.file) {
            const result = await upload_single_image(req.file)
            imageUrl = result.secure_url;
        }
        
        const {userName, email, password} = req.body;
        
        // verify email id user
        if(!email || !password || !userName) 
            throw new ValidationError("Missing necessary data.")

        // verify the email id is not associated with any other account
        const isUserAlreadyExists = await userModel.findOne({email: email});
        console.log(isUserAlreadyExists)
        if(isUserAlreadyExists)
            throw new ConflictError("Email already associated with another account.")

        const hashedPassword = await bcrypt.hash(password, 10);
      
        const newUserDetails = {
            userName, 
            email, 
            password: hashedPassword
        }
    
        if(imageUrl) newUserDetails.profilePicture = imageUrl 
    
        const newUser = await userModel.create(newUserDetails);

        const jwtToken = createToken(newUser, newUser._id)
        console.log(jwtToken)
        res.send({newUser, jwtToken})
        
    } catch (error) {
        next(error)
    }


}

module.exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        console.log(email, password)

        if(!email || !password) {
            throw new ValidationError("Missing necessary data.")
        }

        const userDoc = await userModel.findOne({email});
        if(!userDoc)
            throw new UnauthorizedError("Email or password incorrect");
 

        result = await bcrypt.compare(password, userDoc.password);

        if(!result){
            throw new UnauthorizedError("Email or password incorrect");
        }
        
        const jwtToken = createToken(userDoc, userDoc._id)
        res.send({jwtToken})

    } catch (error) {
        next(error)
    }
}

module.exports.auth = (req, res, next) => {
    try {
        if(req.user)
            res.json(req.user)
        else 
            throw new UnauthorizedError('You are not authorized')
    } catch (error) {
        next(error)
    }
}

// searching users and groups
module.exports.get_user = async(req, res, next) => {
    try {
        const {search} = req.query;
        
        const groupList = await chatModel.find({
            name : { $regex: search, $options: 'i'}, 
            $or : [{scope: "public"}, {"participants.userId": req.user.id}]
            
        })

        const userList = await userModel.find({
            $or: [
              { userName: { $regex: search, $options: 'i'} },
              { email: { $regex: search, $options: 'i'} }
            ], 
            _id: {$ne: req.user.id}
          }, {
            userName: 1, 
            email: 1, 
            profilePicture: 1
          });


        const data = []
        if(groupList.length)
            data[0] = {
                list: groupList, 
                tag: "GROUPS"
            }
        
        data.push({
            list: userList, 
            tag: "USERS"
        })

        res.send({content: data})

    } catch (error) {
        next(error)
    }
}

// fetch all users
module.exports.fetch_all_users = async(req, res, next) => {
    try {
        const userList = await userModel.find({},{email: 1, _id: 1})
        res.send(userList)
    } catch (error) {
        next(error)
    }
}

// getting all the chat in which the user is a participant
module.exports.get_user_chat = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const chats = await chatModel.find({"participants.userId": userId}).populate("participants.userId")
        res.send({chats})
    } catch (error) {
        next(error)
    }
}