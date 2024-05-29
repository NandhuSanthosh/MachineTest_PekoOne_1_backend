const userModel = require("../model/userModel");
const { UnauthorizedError } = require("./errorMiddleware");
const jwt = require("jsonwebtoken")

module.exports.parser = async function(req, res, next){
    const authToken = req.cookies.token
    if(authToken){
        try{
            const tokenData = await jwt.verify(authToken, process.env.JWT_KEY)    
            let userDetails = await userModel.findById(tokenData.id, {password: 0});
            req.user = userDetails;
        }
        catch(error){
            console.log("From fetch:", error.message)
        }
    }
    next(); 
}

module.exports.isProtected = async(req, res, next) => {
    try {
        if(req.user){
            next();
        }
        else{
            throw new UnauthorizedError("You are not authorized")
        }
    } catch (error) {
        next(error)
    }
}

