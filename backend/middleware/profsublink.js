///NOT USED....!


const express=require("express")
const Subject=require('../models/Subject')
const Student=require("../models/Student")
//const Prof = require("../models/Prof")
const Attandance=require("../models/Attandance")

//for professor
const setonsave=async function(doc)
{
    if(doc&&doc.subjects&&doc.subjects.length>0)
    {
        try{

            await Subject.updateMany({subjectcode :{$in:doc.subjects}},{$set:{professorId:doc.profId}})
            console.log("subject linked ot prof")
        }
        catch(error)
        {
            console.log("error ha happened",error)
        }
    }
    console.log("this is triggered")
}

const emptyondelete=async function(profId,next)
{
    let teacherid=profId
    console.log(teacherid)
    try{

        await Subject.updateMany({professorId:profId},{$unset:{professorId:""}})
        console.log("teacher linked removed successfully")
        next()
        
    }
    catch(error)
    {
        console.log("unable to empty the profid",error.message);
    }
console.log("empty on delete triggered")
}




//for sub-student
//adding sub
const addsub=async(semester,department,code)=>
{
    
    console.log("add sub called")
    await Student.updateMany({semester,department},{$addToSet:{subjectcode:code}},{multi:true})
}


//removing sub
const removesub=async(semester,department,id,professorId,subjectcode)=>
{
    console.log("remove sub called")
    await Student.updateMany({semester,department},{$pull:{subjectcode:id}},{multi:true})
   // await Prof.updateMany({profId:professorId},{$pull:{subjects:subjectcode}})

    
}

//adding student
const addstud=async(semester,department)=>
{
    const subjects=await Subject.find({semester,department})
    this.subjectcode = subjects.map(subject => subject._id);

}

const updatestu=async(semester,department,nextsemester)=>
{
    console.log(semester, " ",department," ",nextsemester)
 await Student.updateMany({semester,department},{$unset:{subjectcode:""}})
  const subjects=await Subject.find({semester:nextsemester,department})
  console.log("the subjects of next sem: ",subjects)
  const subject_id=subjects.map(subject=>subject._id)
  console.log(subject_id)
  return subject_id
}



//adding the student in the attandance schema whenever an student is being added
const addinattandance=async(studentid,studentrefid)=>
{
    try{
        let tempattandance=await Attandance.findOne({studentid})
        if(tempattandance)
        {
            return res.status(200).send("student alreaddy exits in schema")
        }
        tempattandance=new Attandance({
            studentrefid,studentid
    
        })
        await tempattandance.save()
            console.log("this addinattandance called")
    }
  catch(error)
  {
    console.log(error.message)
    return res.status(500).send("internal server error")
  }
}
module.exports={setonsave,emptyondelete,removesub,addsub,addstud,updatestu,addinattandance}