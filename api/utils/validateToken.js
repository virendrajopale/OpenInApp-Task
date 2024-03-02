const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')

 const validateToken=asyncHandler(async(req,res,next)=>{
    var token;
    var authHeader=req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token=authHeader.split(" ")[1];
      
        jwt.verify(token,process.env.ACCESS_SECRET_TOKEN,(err,decoded)=>{
            
            if(err){
                res.status(401);
                console.log(err)
                throw new Error("User is Not Authorized")
            }
            // console.log(decoded);
            req.user=decoded.user
        });
        if(!token){
            res.status(402)
            throw new Error("User is Not Authorized")
        }
    }
    next();
})
module.exports=validateToken