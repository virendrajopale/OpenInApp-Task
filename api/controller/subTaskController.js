const asyncHandler = require("express-async-handler")
const SubTask = require('../model/subtaskModel')
const Task = require('../model/taskModel')
const { Error } = require("mongoose")
exports.createSubTask = asyncHandler(async (req, res, next) => {

    const { task_id, title, description } = req.body
    try {
        const subtask = await SubTask.create({
            task_id,
            title,
            description,
            created_at: Date.now()
        })

        res.status(201).json({
            subtask
        })

    } catch (err) {
        res.status(404).json({
            messege: "error",
            err
        })
    }
})
exports.getAllSubTask = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.find({ user: userId, deleted_at: null });
        const taskIds = tasks.map((task) => task._id);

        const subTasks = await SubTask.find({
            task_id: { $in: taskIds },
        });
        const data = {
            subTasks: subTasks.filter((subTask) => subTask.deleted_at === null),
            totalSubTasks: subTasks.length,
        };

        res.status(200).json({
            data
        });
    } catch (err) {
        res.status(400).json({
            message: "Error in id"
        })
    }
})
exports.getsubTaskByUser = asyncHandler(async (req, res, next) => {
    try {
        const id = req.params.id;
        const task = await Task.find({ user: id, deleted_at: null })
        // const ids=task.map((sbtask)=>sbtask.)
        const taskIds = task.map((tsk) => tsk._id);
        const subtask = await SubTask.find({ task_id: taskIds });
        if (!subtask) {
            res.status(402).json({
                messege: "Subtask does not exist"
            })
        }
        res.status(201).json({
            subtask
        })

    } catch (err) {
        res.status(400).json({
            message: "Error in id"
        })
    }
})
exports.updateSubTask = asyncHandler(async (req, res) => {
    const { sid } = req.params;

    if (!sid) {
        throw new Error('Sub task ID is required');
    }
   
    const { status } = req.body;

    if (!status) {
        throw new Error('Status is required');
    }

    if ([0, 1].includes(parseInt(status)) === false) {
        console.log(status);
        throw new Error('Invalid status');
    }

    const subTask = await SubTask.findOneAndUpdate(
        { _id: sid ,
         status ,
        updated_at:Date.now()}
      
    );

    if (!subTask) {
        throw new Error('Sub task not found');
    }

    const subTasksWithSameTaskId = await SubTask.find({
        task_id: subTask.task_id,
       
    });

    const uniqueTaskStatuses = [
        ...new Set(subTasksWithSameTaskId.map((subTask) => subTask.status)),
    ];

    let TaskStatus = 'TODO';

    if (uniqueTaskStatuses.length === 1) {
        if (uniqueTaskStatuses[0] === 1) {
            TaskStatus = 'DONE';
        }
    } else {
        TaskStatus = 'IN_PROGRESS';
    }

    const task = await Task.findOneAndUpdate(
        { _id: subTask.task_id },
        { status: TaskStatus },
        { new: true }
    );

    res.status(200).json( {
                subTask,
                task
            })

});

exports.deleteSubTask = asyncHandler(async (req, res) => {
    const { sid } = req.params;

    if (!sid) {
        throw new Error('Sub task ID is required');
    }

   

    const subTask = await SubTask.findOneAndUpdate(
        { _id: sid },
        { deletedAt: Date.now() },
        { new: true }
    );

    if (!subTask) {
        throw new Error('Sub task not found');
    }

    const subTasksWithSameTaskId = await SubTask.find({
        task_id: subTask.task_id,
        deletedAt: null,
    });

    const uniqueTaskStatuses = [
        ...new Set(subTasksWithSameTaskId.map((subTask) => subTask.status)),
    ];

    let TaskStatus = 'TODO';

    if (uniqueTaskStatuses.length === 1) {
        if (uniqueTaskStatuses[0] === 1) {
            TaskStatus = 'DONE';
        }
    } else {
        TaskStatus = 'IN_PROGRESS';
    }

    const task = await Task.findOneAndUpdate(
        { _id: subTask.task_id },
        { status: TaskStatus },
        { new: true }
    );

     res.status(200).json(subTask);
});