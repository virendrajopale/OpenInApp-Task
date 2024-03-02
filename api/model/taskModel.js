const mongoose=require('mongoose')

const TaskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    }
    ,
    due_date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO',
    },
    priority: {
        type: Number,
        enum: [0, 1, 2, 3],
       
    },
    deleted_at: {
        type: Date,
        default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
})
module.exports =new mongoose.model('Task',TaskSchema)