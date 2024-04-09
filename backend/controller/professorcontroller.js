const express=require('express')
const Admin=require('../models/Admin')
const Prof=require('../models/Prof')
const Subject=require('../models/Subject')
const {emptyondelete}=require('../middleware/profsublink')
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

//@desc deleting the professor
//@route DELETE/prof/deleteprof/:id
//@access public

const deleteprof=(async(req,res)=>
{
   try{
      let prof=await Prof.findById(req.params.id)
      if(!prof)
      {
         return res.status(404).send("prof not found")
      }
      await emptyondelete(prof.profId)
      await Prof.findByIdAndDelete(req.params.id)
      return res.status(200).send("prof deleted successfully")
   }
   catch(error)
   {
      console.log("error occured in deleting",error.message)
      return res.status(500).send("internal errrror")
   }
})

const getprof=(async(req,res)=>{
   
})

module.exports={registerprof,deleteprof, getprof}
