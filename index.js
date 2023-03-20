const connectToMongo = require('./db')
const express=require('express')
const cors = require('cors')

const app=express();
connectToMongo();
const PORT=process.env.PORT ||5000


app.use(cors()) 
app.use(express.json());

app.use('/api/auth',require('./routers/auth'))
app.use('/api/notes',require('./routers/notes'))

app.listen(PORT,()=>{
    console.log(`connected to PORT ${PORT}`)
})
 

/*
Git Commands
-------------
git branch -m back-end master
git fetch origin
git branch -u origin/master master
git remote set-head origin -a

*/