const express=require('express')
const dotenv=require('dotenv')
const connectDB = require('./database/database');
const app = require('./app');
const { updateTaskPriority } = require('./crons/taskCrons');
const { callDueDatePassedUsers } = require('./crons/callCrons');


dotenv.config({})
//database
connectDB();

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
    updateTaskPriority.start;
    callDueDatePassedUsers.start
})