const express=require('express')
const app=express()
const path=require('path')
const port=4000;
var cors=require('cors')
const {Server}=require('socket.io')
const{createServer}=require('node:http');
//importing the professor events
const professorsidedetails=require('./events/professorsideevents.js')
app.use(cors())
require('./database/dbcon')
app.use(express.json())
const server=createServer(app)
const io=new Server(server,{
    cors:{
        origin:"*",
        methods:['GET','POST'],
        credentials:true
    }
})

let allowattandance={subid:'',enable:''}


io.on("connection",(socket)=>
{
  console.log("the user is conneceted with the id:",socket.id)
  professorsidedetails(io,socket)

})

//extablashing the routes
app.use('/admin',require(path.join(__dirname,'./routes/adminauth.js')))
app.use('/sub',require(path.join(__dirname,"./routes/subject.js")))
app.use('/prof',require(path.join(__dirname,"./routes/professor.js")))
app.use('/student',require(path.join(__dirname,"./routes/student.js")))
app.use('/attandance',require(path.join(__dirname,'./routes/facerecognisation.js')))

//to accept the incoming json

server.listen(port,()=>
{
    console.log(`the server is listening at ${port}`);
})