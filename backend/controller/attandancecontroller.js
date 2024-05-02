const express = require("express");
const axios = require("axios");
const { subjectcode } = require("../middleware/profsublink");
const Attandance = require("../models/Attandance");
const Student = require("../models/Student");
const Subject = require("../models/Subject");

const markattandance = async (req, res) => {
  const { studentid,subjectcode, subjectname, status, attandancedate} = req.body;
  try {
    if (!studentid||!subjectcode || !subjectname || !status || !attandancedate) {
      return res.status(401).json(
          "unable to mark the attandance due to missing fields from frontend"
        );
    }
    /*
    const response = await axios.get("http://127.0.0.1:5001/recognize");
    console.log(response.data.message);
    console.log("Recognized faces:", response.data.recognized_face);
    console.log(subjectcode, subjectname, status, attandancedate);
*/
    //fething the correspondingdata to from the Subejct and Student schema
    const student = await Student.findOne({
      studentid,
    });  
    if (!student) {
     return res.status(404).json(
          "student not found,please add the student before taking attandance"
        );
    }
    const studentrefid = student._id;
    console.log("the student id is:", studentrefid);
    
    const subject = await Subject.findOne({
      subjectcode,
    });
    if (!subject) {
       return res
        .status(404)
        .json(
          "subject not found please add the subject before marking the attandace"
        );
    }
    const subjectid = subject._id;
    console.log("subjectid is:", subjectid);

    //handiling the date part
    /*
    const [year, month, day] = attandancedate.split("-");
    const parseddate = new Date(year, month, day);
    if (isNaN(parseddate.getTime())) {
      res.status(400).send("date is not valid ");
    }
    parseddate.setHours(0, 0, 0, 0);
    */
    
    const parsedDate = new Date(attandancedate);
    const month=parsedDate.getMonth()+1// getmonth returns 0 based indexing
    console.log("month is:",month)
    if (isNaN(parsedDate.getTime())) {
      console.log(attandancedate)
    
      return res.status(400).json("Invalid date format for attandancedate");
    }
    console.log("the student id is:",studentid)
    console.log("the subject code is :",subjectcode)
    console.log("the attadancedate is:",attandancedate)
    console.log("the status is :",status)
    //return res.status(200).json("received data successfully")

    //checking if there is alreay an entry for the sujectid for the current student

    
   let tempattandance = await Attandance.findOne({
      studentrefid,
  
    });

    if (!tempattandance) {
        tempattandance = new Attandance({
        studentrefid,
        studentid: studentid,
        attendance: [
          {
            subjectid,
            subjectcode,
            subjectname,
            month,
            entires: [
              {
                date: attandancedate,
                status:status,
              },
            ],
          },
        ],
      });
    }else{
        let subjectindex= tempattandance.attendance.findIndex(entry=>entry.subjectid.equals(subjectid)&&entry.month===month)
        if(subjectindex!==-1)
        {
            tempattandance.attendance[subjectindex].entires.push({
                date:attandancedate,
                status
            })
        }
        else{
            tempattandance.attendance.push({
                subjectid,
                subjectcode,
                subjectname,
                month,
                entires:[
                    {
                        date:attandancedate,
                        status
                    }
                ]
            })
        }

        
    }
    tempattandance.save()
    
       return  res.status(200).json("attandance saved succesfully")
    

  
     // res.status(200).send("Attendance saved successfully");
     

  } catch (error) {
    console.log(error.message);
    res.status(500).json("internal server error");
  }
};




//gettting the attandance of the student for the current subject

const getattandace=(async(req,res)=>
{
  let success=false;
  try{
    console.log(req.user.id)
    const{subjectcode}=req.body
    const studentattandace=await Attandance.findOne({studentrefid:req.user.id})
    if(!studentattandace)
    {
      return res.status(404).send("no student attandance exits")
    }

  
    //console.log(studentattandace)
    const subjectattandance= studentattandace.attendance.find(entry=>entry.subjectcode.toString()===subjectcode)
    if(!subjectattandance)
    {
      return res.status(404).json({success,"message":"subject do not found"})
    }
    //console.log(subjectattandance.entires)
    success=true
    return res.status(200).json({success,subjectattandance})


  }
  catch(error)
  {
    console.log(error.message)
    return res.status(500).send("internal server error")
  }



})


//getting the subject attandance for the proffsor

const getattandaceprof=(async(req,res)=>
{
  try{

    const {subjectcode}=req.body
    //using the aggregrate pipelines to reduce the load at the server side

    const availableattandace=await Attandance.aggregate([
      {
        $match:{"attendance.subjectcode":subjectcode}
      },
      {
        $unwind:"$attendance"
      },
      {
        $match:{"attendance.subjectcode":subjectcode}
      },
      {
        $unwind:"$attendance.entires"
      },
      {
        $group:{
          _id:{
            subjectcode:"$attendance.subjectcode",
            subjectname:"$attendance.subjectname",
            studentid:"$studentid"
          },
         attendance: {
             $push:{
            entires:"$attendance.entires"
             }
          }
        },
      },
        {
          $project:{
            _id:0,
            subjectcode:"$_id.subjectcode",
            studentid:"$_id.studentid",
            subjectname:"$_id.subjectname",
            attendance:1
          }
        }

      
    ])

    if(availableattandace.length>0)
    {
      console.log(availableattandace)
      return res.status(200).json(availableattandace)
    }
    return res.status(404).json("attendance not found")
  }
  catch(error)
  {
    console.log(error.message)
    return res.status(500).json("some internal error happened")
  }

  
})


module.exports = { markattandance,getattandace,getattandaceprof };
