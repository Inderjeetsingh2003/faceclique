const express=require("express")
const Subject=require('../models/Subject')
const setonsave=async function(doc)
{
    if(doc&&doc.subjects&&doc.subjects.length>0)
    {
        try{

            await Subject.updateMany({ subjectname:{$in:doc.subjects}},{$set:{professorId:doc.profId}})
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
module.exports={setonsave,emptyondelete}