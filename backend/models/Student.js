const mongoose=require("mongoose")
const{setsubinstudent}=require('../middleware/profsublink')
const Subject=require("../models/Subject")
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
studentschema.pre('save', async function(next) {
    try {
        const subjects = await Subject.find({ department: this.department, semester: this.semester });
        console.log(subjects)
        this.subjectcode = subjects.map(subject => subject._id);
        next();
    } catch (error) {
        next(error);
    }
});


const Student=mongoose.model("student",studentschema)
module.exports=Student;