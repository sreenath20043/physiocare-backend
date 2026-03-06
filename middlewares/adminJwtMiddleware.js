
const  jwt = require('jsonwebtoken')

const adminJwtMiddleware = (req,res,next)=>{
    console.log("inside adminJwt Middleware");
    // find token
    const token = req.headers.authorization.slice(7)
    
    console.log(token);
    // verify token
    try {
    const jwtVerification =jwt.verify(token,process.env.jwtKey)
    console.log(jwtVerification);
    req.payload = jwtVerification.userMail
    req.role=jwtVerification.role
    if(jwtVerification.role == "physiocareAdmin"){
        next()
    }
    
    else{
        res.status(401).json("Unauthorized User",err)
    }
    
    } catch (error) {
        res.status(401).json("Authentication Error",error)
    }
    
    
}
module.exports = adminJwtMiddleware
