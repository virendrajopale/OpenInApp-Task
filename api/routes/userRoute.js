const express=require('express')
const { createUser, getUser, loginUser, currentUserDetails, logoutUser } = require('../controller/userController')
const validateToken = require('../utils/validateToken')

const router=express.Router()

router.route('/user/newUser').post(createUser)
router.route('/user/allUsers').get(validateToken,getUser)
router.route('/user/login').post(loginUser)
router.route('/user/logout').post(validateToken,logoutUser)
router.route('/user/current').get(validateToken,currentUserDetails)
module.exports=router;