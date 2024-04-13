const express=require('express')
const app=express()
const path=require('path')
const port=4000;
var cors=require('cors')
app.use(cors())
require('./database/dbcon')
app.use(express.json())
//extablashing the routes
app.use('/admin',require(path.join(__dirname,'./routes/adminauth.js')))
app.use('/sub',require(path.join(__dirname,"./routes/subject.js")))
app.use('/prof',require(path.join(__dirname,"./routes/professor.js")))
app.use('/student',require(path.join(__dirname,"./routes/student.js")))
app.use('/attandance',require(path.join(__dirname,'./routes/facerecognisation.js')))

//to accept the incoming json

app.listen(port,()=>
{
    console.log(`the server is listening at ${port}`);
})