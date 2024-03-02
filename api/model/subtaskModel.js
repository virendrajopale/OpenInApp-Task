const mongoose=require('mongoose')
 const SubTaskSchema=new mongoose.Schema({
    task_id:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'Task'
    },
    status:{
        type:Number,
        required:true,
        enum:[0,1],
        default:0
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    created_at:{
        type: Date,
        default: null,
    },
    updated_at:{
        type: Date,
        default: null,
    },
    deleted_at: {
        type: Date,
        default: null,
    },
 })

 module.exports=new mongoose.model('SubTask',SubTaskSchema)