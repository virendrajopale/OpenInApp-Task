const jwt=require('jsonwebtoken')

exports.accessToken=(user,statusCode,res)=>{

    const token= jwt.sign({
        user: {
            id:user._id,
          priority:user.priority,
         phone_Num:user.phone_Num
      }},
      process.env.ACCESS_SECRET_TOKEN,
      {expiresIn:process.env.JWT_EXPIRE})

      const options={
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRE *24 *60* 60 *1000
        ),
        httpOnly:true
    }
    // res.status(statusCode).cookie('token',token,options).json({
    //     success:true,
    //     user,
    //     token,
    // })

    return token;
}