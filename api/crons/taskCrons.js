const { calculateTaskPriority } = require('../utils/datechecker');

const nodecron =require('node-cron');
const Task= require("../model/taskModel");

exports.updateTaskPriority = nodecron.schedule('0 0 * * *', async () => {
    const tasks = await Task.find({
        deletedAt: null,
    });

    const updatedTasksIds = tasks.map((task) => {
        task.priority = calculateTaskPriority(task.due_date);
        task.save();
        return task._id;
    });
    console.log(`Updated tasks: ${updatedTasksIds}`);
});

