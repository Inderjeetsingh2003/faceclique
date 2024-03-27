const express=require('express')
const app=express()
const path=require('path')
const port=5000;
require('./database/dbcon')

app.use(express.json())
//extablashing the routes
app.use('/admin',require(path.join(__dirname,'./routes/adminauth.js')))
app.use('/sub',require(path.join(__dirname,"./routes/subject.js")))

//to accept the incoming json

app.listen(port,()=>
{
    console.log(`the server is listening at ${port}`);
})