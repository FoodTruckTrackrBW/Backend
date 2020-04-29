
const jwt = require('jsonwebtoken')



 function  generateToken(user){
    const payload = {
        userId: user.id,
        username: user.username,
        userType: user.user_type,
        favorite_cuisine_type: user.favorite_cuisine_type || "Not Specified"
    }
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: '1d'
    }
    return jwt.sign(payload, secret, options)
     

}


function  authenticator(req,res,next){
    const token =  req.headers.authorization
    if(token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
    if(error) {
        res.status(401).json({message: "Something is wrong with your token"})
    } else {
        req.decodedToken = decodedToken
        next();
    }
    })
} else {
    res.status(401).json({message: "Please Sign in!"})
}
};


function  operator(req,res,next){
    if(req.decodedToken.userType === 'operator') {
      next();
    } else {
        res.status(401).json({message: "Wrong account type"})
    }
};

function  diner(req,res,next){
    if(req.decodedToken.userType === 'diner') {
      next();
    } else {
        res.status(401).json({message: "Wrong account type"})
    }
};

function dinerRegister(req,res,next){
    const { username, password, email, user_type } = req.body;
    if(!username || !password || !email || !user_type) {
        res.status(400).json({error: "Please provide username, password, email and user_type to register"});
    } else {
         next();
    }
    
}



module.exports = { generateToken, authenticator, diner, operator, dinerRegister}