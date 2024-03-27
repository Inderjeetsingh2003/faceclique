const express=require("express")
const Subject=require('../models/Subject')
const setonsave=async function(doc)
{
    if(doc&&doc.subjects&&doc.subjects.length>0)
    {
        try{

            await Subject.updateMany({ _id:{$in:doc.subjects}},{$set:{professorId:doc.profId}})
            console.log("subject linked ot prof")
        }
        catch(error)
        {
            console.log("error ha happened")
        }
    }
    console.log("this is triggered")
}
module.exports=setonsave