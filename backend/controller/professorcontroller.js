const express=require('express')
const Admin=require('../models/Admin')
const Prof=require('../models/Prof')
const Subject=require('../models/Subject')
//@desc registering professor
//@route POST/prof/
//@access public

const registerprof=(async(req,res)=>
{
 const{profId, name, email, subjects, department}=req.body
 console.log(req.body)
 try{
     const profex= await Prof.findOne({profId:req.body.profId})
     if(profex)
     {
        return res.status(200).send("subject already exists")
     }
     const professor= new Prof({
        profId, name, email, subjects, department
     })
     await professor.save()
    
     return res.status(200).send("Professor added successfully")
 }
   catch(error)
   {
    console.log(error.message)
    return res.status(500).send("internal server error occured")
   } 

})

module.exports={registerprof}
