const asyncHandler=require('express-async-handler');
const User = require('../model/userModel');
const { accessToken } = require('../utils/jwt');

exports.createUser=asyncHandler(async(req,res,next)=>{
  const {phone_Num,priority}=req.body;
  if(!phone_Num){
    res.status(400)
    return new Error('Enter the Phone Number')
  }
  const userAvailable=await User.findOne({phone_Num});
    if(userAvailable){
        res.status(400);
        throw new Error("User is Already registered..!");
    }
  try{
    const user=await User.create({
        phone_Num,
        priority
    })
   
    const token=accessToken(user,200,res);

    if(user){
        res.status(200).json(
            {
                user,
                token:token
            }
        )
    }
  }catch(err){
     throw new Error("Cannot Create User")
  }
})
exports.loginUser=asyncHandler(async (req, res) => {
     
        const {phone_Num} = req.body;
    
        if (!phone_Num) {
            throw new Error('Phone number is required');
        }
    
        const user = await User.findOne({
            phone_Num,
        });
    
        if (!user) {
            throw new Error( "User doesn't exists with given phone number");
        }
    
        
    
        const loggedInUser = await User.findById(user._id);
        const token=accessToken(loggedInUser,200,res)
        const options = {
            httpOnly: true,
            secure: true,
        };
        
         res.status(200).cookie('accessToken', token, options).json(
                    {
                        user: loggedInUser,
                        token:token,
                    }
                )
        
})

exports.logoutUser = asyncHandler(async (req, res,next) => {
    await User.findByIdAndUpdate(req.user.id, {
       
            token: null,
        new: true,
    });

    const options = {
        httpOnly: true,
        secure: true,
    };

     res.status(200).clearCookie('accessToken', options)
        .json( {messege:"LogOut Successfully"});
});

exports.getUser=asyncHandler(async(req,res,next)=>{
    try{
        const user=await User.find({})
        res.status(201).json({user})
    }
    catch(err){
        console.log(err)
    }
})

exports.currentUserDetails=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.user.id)
    res.status(201).json(
      user
    )
  })
  