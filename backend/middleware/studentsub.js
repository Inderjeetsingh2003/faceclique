const Subject=require("../models/Subject")
//const {Student}=require('../models/Student')
const {stuupdate}=require("../models/Student")
const getsubbyid=async (department,semester)=>
{
    return Subject.find({department,semester});
}




module.exports={getsubbyid,stuupdate}