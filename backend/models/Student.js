const mongoose=require("mongoose")
//const Subject=require("../models/Subject")
//const {getsubbyid}=require("../models/Subject.js")
//const {getsubbyid}=require('../middleware/studentsub')
const studentschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
   email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    studentid:{
        type:String,
        required:true
    },
    department:
    {
        type:String,
        required:true
    },
    semester:{
            type:String,
            required:true
    },
    subjectcode: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }]
})

// studentschema.pre('save', async function() {
//     try {
//         console.log("Student");
//         const subjects = await Subject.find({ department: this.department, semester: this.semester });
//         console.log(subjects);

//         // Extract subject codes from fetched subjects
//         const subjectCodes = subjects.map(subject => subject._id);

//         // Update students matching department and semester
//         await Student.updateMany(
//             { department: this.department, semester: this.semester },
//             { $addToSet: { subjectcode: { $each: subjectCodes } } }
//         );

//         console.log("Students subjects updated successfully");
       
//     } catch (error) {
//         console.log(error.message)
//     }
// });

studentschema.pre('save', async function(next) {
    try {
        const Subject=require("../models/Subject")  //--> dynamically calling the import statement whenever it is required( lazy loading) -->prevents CRICULAR DEPENDANCY
       const subjects = await Subject.find({ department: this.department, semester: this.semester });
      // const subjects=await getsubbyid(this.department,this.semester) 
       console.log(subjects)
        this.subjectcode = subjects.map(subject => subject._id);
        next();
    } catch (error) {
        next(error);
    }
});

//defining the student update on adding subejct
const Student=mongoose.model("student",studentschema)
/*
const stuupdate=async(department,semester,code)=>
{
    await Student.updateMany({department,semester},{$addToSet:{subjectcode:code}},{multi:true})
}*/
module.exports=Student