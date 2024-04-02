const express=require("express")
const Student=require('../models/Student')
const {addstud,updatestu}=require("../middleware/profsublink")

//registering the student
const registerstudent=(async(req,res)=>
{
    const{name,email,studentid,department,semester}=req.body
    try{
    const exstudent=await Student.findOne({studentid})
    if(exstudent)
    {
        return res.status(200).send("student already exists")
    }
   const newstudent=new Student({
        name,email,studentid,department,semester
    })
    addstud(newstudent.semester,newstudent.department)
   await newstudent.save()
    return res.status(200).send("student saved successfully")
}
catch(error)
{
    console.log(error.message)
    res.status(500).send("student data did not saved")
}
})


const updatestudent=(async(req,res)=>
{
    const{newsemester}=req.body
    try{

        const exstu= await Student.findById(req.params.id)
        console.log(exstu)
        if(!exstu)
        {
            return res.status(404).send("no such user exits")
        }
            const subject_id= await updatestu(exstu.semester,exstu.department,newsemester)
            await Student.findByIdAndUpdate(req.params.id,{semester:newsemester,subjectcode:subject_id})
            return res.status(200).send("student updated successully")
    }
    catch(error)
    {
        console.log("unable to update the student")
        console.log(error.message)

    }

})
module.exports={registerstudent,updatestudent}