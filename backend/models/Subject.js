const mongoose=require("mongoose")
const {Schema}=mongoose
//const Student=require('../models/Student')\
//const {stuupdate}=require('../models/Student')
//const{stuupdate}=require('../middleware/studentsub')
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
    credits:{
        type:String,
        required:true
    },
    totalhours:{
        type:String,
        require:true
    }

    
   
},{
    
        timestamps:true
    
})
 
//logic error
//adding the of the added subejct code to students,which belong to the same semester
/*
subjectschema.post('save',async function()
{
    //stuupdate(this.semester,this.department,this._id)
    const Student=require("../models/Student") //--> dynamically calling the import statement whenever it is required( lazy loading) -->prevents CRICULAR DEPENDANCY
    console.log(this.semester,this.department)
    console.log(Student)
    await Student.updateMany({department:this.department,semester:this.semester},{$addToSet:{subjectcode:this._id}},{multi:true})
})
*/

//removing the subject code from students when a subject is deleted
//PENDING

/*subjectschema.pre('findOneAndDelete',async function()
{
    const {Student}= await require("../models/Student")
   console.log("subject delete middleware is triggered")
   const subject=this
   const{semester,department}=subject
    await Student.updateMany({semester,department},{$pull:{subjectcode:doc._id}},{multi:true})
})
*/






const Subject=mongoose.model("subject",subjectschema)
module.exports=Subject