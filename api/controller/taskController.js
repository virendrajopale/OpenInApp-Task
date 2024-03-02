const asyncHandler = require("express-async-handler");
const Task= require("../model/taskModel");
const { isValidDate, isNotPastDate, calculateTaskPriority } = require("../utils/datechecker");
const User= require("../model/userModel");
const {isValidObjectId}=require('mongoose')
const mongoose=require('mongoose')
const SubTask=require('../model/subtaskModel')
exports.newTask=asyncHandler(async(req,res,next)=>{
    const {title,description,due_date}=req.body;
    if(!title | !description | !due_date){
        throw new Error("Error Occured");
    }
    if(!isValidDate(due_date) | !isNotPastDate(due_date)){
        throw new Error("Date Error Occured");

    }
    
    try{
        const task=await Task.create({
            title,
            description,
            due_date,
            user:req.user.id,
            priority:calculateTaskPriority(due_date)
        })
       if(task){
        
        await User.findByIdAndUpdate(req.user.id, {
                $push: { tasks: task._id },
            });
        res.status(201).json({
           task
        })
       }
    }catch(err){
     console.log(err)
        res.status(404).json({
            messege:"Server Error",
            err
        })
    }
})
exports.getTasksByUsers=asyncHandler(async(req,res,next)=>{
    try {
        const { priority, due_date, pageNumber = 1, pageSize = 5 } = req.query;
    
        let query = {};
          query.user = req.user.id;
   
        if (priority) {
          query.priority = priority;
        }
    
 
       
        if (due_date) {
          query.due_date = due_date;
        }
    
        const skip = (pageNumber - 1) * pageSize;

        const tasks = await Task.find(query)
                                .skip(skip)
                                .limit(parseInt(pageSize))
                                .exec();

        res.status(200).json(tasks);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: ' Error' });
      }
})



exports.updateTask = asyncHandler(async (req, res,next) => {
  const {task_id} = req.params;
  let {due_date, status} = req.body;

  if (!due_date && !status) {
      throw new Error('Due date or status is required');
  }

  if (isValidObjectId(task_id) === false) {
      throw new Error('Invalid task ID');
  }

  if (status) {
      status = String(status).toUpperCase();
      if (!['TODO', 'DONE'].includes(status)) {
          throw new Error('Invalid status');
      }
  }


  if (isNotPastDate(due_date) === false || isValidDate(due_date) === false) {
      throw new Error('Due date cannot be in the past or invalid');
  }

  const task = await Task.findOne({
      _id: task_id,
      user: req.user.id,
  });

  if (!task) {
      throw new Error('Task not found');
  }

  if (due_date && isNotPastDate(due_date)) {
      task.due_date = due_date;
      task.priority = calculateTaskPriority(due_date);
  }

  if (status) {
      task.status = status;
      if (status === 'DONE') {
          await SubTask.updateMany(
              {
                  task_id: task._id,
              },
              {
                  status: 1,
              }
          );
      } else if (status === 'TODO') {
          await SubTask.updateMany(
              {
                  task_id: task._id,
              },
              {
                  status: 0,
              }
          );
      }
  }

  const updatedTask = await task.save();

res.status(200).json({ updatedTask});
});
exports.deleteTask = asyncHandler(async (req, res) => {
  const {task_id} = req.params;

  if (isValidObjectId(task_id) === false) {
      throw new Error('Invalid task ID');
  }

  const task = await Task.findOneAndUpdate(
      {
          _id: task_id,
          user: new mongoose.Types.ObjectId(req.user.id),
      },
      {
          deleted_at: Date.now(),
      },
      {
          new: true,
      }
  );

  if (!task) {
      throw new Error('Task not found');
  }

  await SubTask.updateMany(
      {
          task_id: task._id,
      },
      {
          deleted_at: Date.now(),
      }
  );

   res.status(200).json({
              task,
              message:'Task deleted successfully with all subtasks'
          });
});
