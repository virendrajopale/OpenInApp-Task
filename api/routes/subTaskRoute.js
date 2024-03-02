const express=require('express')

const validateToken = require('../utils/validateToken')
const { createSubTask, getsubTaskByUser, getAllSubTask, updateSubTask, deleteSubTask } = require('../controller/subTaskController')


const router=express.Router()

router.route('/newSubTask').post(validateToken,createSubTask)
router.route('/getSubTask/:id').get(validateToken,getsubTaskByUser)
router.route('/getAllSubTask').get(validateToken,getAllSubTask)
router.route('/updateSubTask/:sid').put(validateToken,updateSubTask)
router.route('/deleteSubTask/:sid').delete(validateToken,deleteSubTask)
module.exports=router;