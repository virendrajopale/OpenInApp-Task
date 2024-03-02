const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    phone_Num:{
        type:Number,
        required:true,
        maxLenght:[10],
        minLength:[10],

    },
    priority:{
        type:Number,
        default:0,
        enum:[0,1,2]
    },
    token:{
        type:String,

    },
    tasks:{
        type:[mongoose.Schema.ObjectId],
        ref:'Task'
    },
    token:{
        type:String,

    }
    
},
{
    timestamps:true
})

module.exports=new mongoose.model('User',UserSchema)