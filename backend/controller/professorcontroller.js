const express=require('express')
const Admin=require('../models/Admin')
const Prof=require('../models/Prof')
const Subject=require('../models/Subject')
const {emptyondelete}=require('../middleware/profsublink')
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const ACCESS_TOKEN_SECRET="facecliqueproject"   
//@desc registering professor
//@route POST/prof/
//@access public

const registerprof=(async(req,res)=>
{
  
 const{profId, name, email, subjects, department,password}=req.body
 console.log(req.body)
 try{
     const profex= await Prof.findOne({profId:req.body.profId})
     if(profex)
     {
        return res.status(200).send("subject already exists")
     }
     const salt=await bcrypt.genSalt(10)
     const hashpassword=await bcrypt.hash(password,salt)
     const professor= new Prof({
        profId, name, email, subjects, department,password:hashpassword
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

const proflogin=(async(req,res)=>
{

let success;
    try{
        const{profId,password}=req.body
        console.log(profId,password)
        const user=await Prof.findOne({profId})
        if(!user)
        {
            
            return res.status(404).json({error:"invalid credintals user not found"})
        }
        const comparepassword=await bcrypt.compare(password,user.password)
        if(!comparepassword)
        {
            return res.status(404).json({error:"invalid credintals password different"})
    
        }
        const data={
            user:{
                id:user.id
            }
        }
        console.log(data)
    const accesstoken=jwt.sign(data,ACCESS_TOKEN_SECRET)
    
     success=true;
    return res.status(200).json({success,accesstoken})
    }
    catch(error)
    {
        console.log("invalid to login")
        console.log(error.message)
        return res.status(500).json("internal server error but this is triggered")
    }
   
})

const getprofsub=(async(req,res)=>{

    try {
    
    const professor= await Prof.findById(req.user.id);
    console.log(professor)
    if (!professor) { 
        return res.status(404).send("professor not found");
    }

    
    
    const profId=professor.profId
    console.log(profId)
    const subjects= await Subject.find({professorId:profId})
    if(!subjects)
    {
        return res.status(404).json({error:"subjects not found"})
    }
    console.log(subjects)
  
    return res.status(200).json(subjects) 

   
} 
catch(error){
    console.log(error)
    console.log(error.message)
}
})





module.exports={registerprof,deleteprof, getprofsub,proflogin}
