const mongoose=require("mongoose")
const {Schema}=mongoose
const Student=require('../models/Student')
const subjectschema=new mongoose.Schema({
    
    professorId:{
        type:String,
        default:null,
        ref:'Prof'
    }, 
    
    
    subjectcode:{
        type:String,
        required:true
    },
    subjectname:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true

    },
    semester:{
        type:String,
        required:true
    },
    
   
},{
    
        timestamps:true
    
})
 
//logic error
subjectschema.post('save',async function()
{
 try{   
  const avastudent=await Student.find({department:this.department,semester:this.semester})
  console.log("hello this is triggered")
await Promise.all(avastudent.map(async(stu)=>
{
    if(!stu.subjectcode.includes(this._id))
    {
        stu.subjectcode.push(this._id);
        await stu.save()
    }
}))
  
} 
catch(error)
{
    console.log(error.message)
}
})

const Subject=mongoose.model("subject",subjectschema)
module.exports=Subject