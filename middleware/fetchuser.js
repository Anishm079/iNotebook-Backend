const jwt = require("jsonwebtoken");

const JWT_SECRET = "Anish$123";

const fetchuser = (req,res,next) => {
    //Get user from jwt tocken and add id to the req object
    const token = req.header("auth-token");
    if(!token){
        res.status(401).send({error:"Please Authenticate Using A Valid Token"})
    }
    try {
        const data= jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        // console.log(data.user)
        next();
    } catch (error) {
        res.status(401).json({message:"Please Authenticate Using A Valid Token"})
    }
}

module.exports = fetchuser