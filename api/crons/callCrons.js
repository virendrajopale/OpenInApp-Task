
const nodecron =require('node-cron');
const {makeOutGoingCall}  =require('../utils/twilio');
const Task= require("../model/taskModel");
const User= require("../model/userModel");
exports.callDueDatePassedUsers = nodecron.schedule('0 12 * * *', async () => {
    const tasks = await Task.find({
        deleted_at: null,
        due_date: {
            $lte: new Date(),
        },
        status: {
            $ne: 'DONE',
        },
    });

    const users = await User.find({
        _id: {
            $in: tasks.map((task) => task.user),
        },
    }).sort({
        priority: 1,
    });

    console.log('Calling Started');
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const task = tasks.find(
            (task) => task.user.toString() === user._id.toString()
        );
        await makeOutGoingCall(
            user.phone_number,
            `Hello this is a reminder for your task ${task.title}`
        );
    }
});

