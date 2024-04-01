const express=require("express")
const Student=require('../models/Student')


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
    
   await newstudent.save()
    return res.status(200).send("student saved successfully")
}
catch(error)
{
    console.log(error.message)
    res.status(500).send("student data did not saved")
}
})

module.exports={registerstudent}