const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express=require('express')
const cors = require('cors');

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);

app.use(express.json())
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))

const user=require('./routes/userRoute')
const task=require('./routes/taskRoute')
const subtask=require('./routes/subTaskRoute')

app.use('/usr',user);
app.use('/task',task);
app.use('/subTask',subtask);
module.exports=app