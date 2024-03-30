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
 
//logic error is resolved here, On adding subject, it gets stored in the students that match the department and semester.
subjectschema.post('save',async function()
{
 try{   
  const avastudent=await Student.find({department:this.department,semester:this.semester})
  console.log(avastudent)
  console.log("hello this is triggered")
await Promise.all(avastudent.map(async(stu)=>
{
    console.log("Inside promise")
    if(!stu.subjectcode.includes(this._id))
    {
        await Student.updateOne(
            { _id: stu._id },
            { $push: { subjectcode: this._id } }
        );
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