const express=require('express')
const Admin=require('../models/Admin')
const Subject=require('../models/Subject')


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
     return res.status(200).send("subject added successfully")
 }
   catch(error)
   {
    console.log(error.message)
    return res.status(500).send("internal server error occured")
   } 

})

module.exports={registersub}