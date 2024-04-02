const express=require('express')
const Admin=require('../models/Admin')
const Subject=require('../models/Subject')
const{removesub,addsub}=require("../middleware/profsublink")

//@desc registering the subject
//@route POST/sub/
//@access public
const registersub=(async(req,res)=>
{
 const{subjectcode,subjectname,department,semester}=req.body
 try{

     const subex= await Subject.findOne({subjectcode:req.body.subjectcode})
     if(subex)
     {
        return res.status(200).send("subject already exists")
     }
     const subject= new Subject({
        subjectcode,subjectname,department,semester
     })
     await subject.save()
     addsub(subject.semester,subject.department,subject._id)

     return res.status(200).send("subject added successfully")
 }
   catch(error)
   {
    console.log(error.message)
    return res.status(500).send("internal server error occured")
   } 

})


//deleting the subject

const deletesub=(async(req,res)=>
{
   let subtodelte=await Subject.findById(req.params.id)
   if(!subtodelte)
   {
      return res.status(404).send("subject not found")
   }
   await Subject.findByIdAndDelete(req.params.id)
   removesub(subtodelte.semester,subtodelte.department,subtodelte._id,subtodelte.professorId,subtodelte.subjectcode)
   return res.status(200).send("subject deleted successfully")

   
})

module.exports={registersub,deletesub}