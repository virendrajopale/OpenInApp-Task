// const { error } = require('console')
const mongoose=require('mongoose')

const connectDB=()=>{
    mongoose.connect(process.env.Db_URL)
    const databse=mongoose.connection
    databse.on('error',(error)=>{
        console.log(error)
    })
    databse.once('connected',()=>{
        console.log("conected DB")
    })
}

module.exports=connectDB