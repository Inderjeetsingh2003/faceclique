const express=require("express")
const Student=require('../models/Student')
const Subject=require('../models/Subject')


//registering the student
const registerstudent=(async(req,res)=>
{
    const{name,email,studentid,department,semester}=req.body
    try{
    const exstudent=await Student.findOne({email})
    if(exstudent)
    {
        return res.status(200).send("student already exists")
    }
   const newstudent=new Student({
        name,email,studentid,department,semester
    })
    
   await newstudent.save()
   console.log({department, semester})

   console.log("Student");
        const subjects = await Subject.find({ department: department, semester: semester });
        console.log(subjects);

        // Extract subject codes from fetched subjects
        const subjectCodes = subjects.map(subject => subject._id);

        // Update students matching department and semester
        await Student.updateMany(
            { department: department, semester: semester },
            { $addToSet: { subjectcode: { $each: subjectCodes } } }
        );

        console.log("Students subjects updated successfully");
       
    return res.status(200).send("student saved successfully")
}
catch(error)
{
    console.log(error.message)
    res.status(500).send("student data did not saved")
}
})

module.exports={registerstudent}