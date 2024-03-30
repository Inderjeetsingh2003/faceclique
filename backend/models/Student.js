const mongoose=require("mongoose")
const Subject=require('../models/Subject')
const express=require("express")
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
// studentschema.pre('updateMany', async function() {
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


const Student=mongoose.model("student",studentschema)
module.exports=Student;