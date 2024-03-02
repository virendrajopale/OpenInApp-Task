const express=require('express')

const validateToken = require('../utils/validateToken')
const { newTask, getTasksByUsers, updateTask, deleteTask } = require('../controller/taskController')

const router=express.Router()

router.route('/newtask').post(validateToken,newTask)
router.route('/userTask').get(validateToken, getTasksByUsers)

router.route('/updateTask/:task_id').put(validateToken, updateTask)
router.route('/deleteTask/:task_id').delete(validateToken, deleteTask)
module.exports=router;