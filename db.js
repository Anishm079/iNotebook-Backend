const mongoose=require('mongoose');
require("dotenv").config()

const mongoURI= process.env.MONGO_URI

const connectToMongo=()=>{
    mongoose.set('strictQuery', true)
    mongoose.connect(mongoURI,{
        useNewUrlParser:true,useUnifiedTopology:true 
    },(error)=>{
        if(error){
            console.log(error) 
        }else{
            console.log("connected to mongodb") 
        }
    })
}

// mongoose.connection.once('open',()=>{
//     console.log("connected to databse")
// }).on('error',(err)=>{
//     console.log(err)
// })

module.exports = connectToMongo