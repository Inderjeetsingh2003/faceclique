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
//adding the of the added subejct code to students,which belong to the same semester

subjectschema.post('save',async function()
{
   await Student.updateMany({department:this.department,semester:this.semester},{$addToSet:{subjectcode:this._id}},{multi:true})
})

//removing the subject code from students when a subject is deleted
subjectschema.post('findOneAndDelete',async function(doc)
{
   console.log("subject delete middleware is triggered")
    await Student.updateMany({semester:doc.semester,department:doc.department},{$pull:{subjectcode:doc._id}},{multi:true})
})


const Subject=mongoose.model("subject",subjectschema)
module.exports=Subject