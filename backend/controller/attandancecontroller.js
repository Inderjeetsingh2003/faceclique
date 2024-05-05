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
            
              entires: [{
                month,
                Entires:[{
                  date:attandancedate,
                  status
                }]
              }

                
              ],
            },
          ],
        });
      }else{
          let subjectindex= tempattandance.attendance.findIndex(entry=>entry.subjectid.equals(subjectid))
          if(subjectindex!==-1)
          {
            const monthexist= tempattandance.attendance[subjectindex].entires.findIndex(entry=>entry.month===month)
            if(monthexist===-1)
            {
              console.log("first time no month hence this is executed")
              tempattandance.attendance[subjectindex].entires.push({
                month,
                Entires:[
                  {
                    date:attandancedate,
                    status
                  }
                ]
              })
            }
            else{
              console.log("month is there henece this is getting executed")
              tempattandance.attendance[subjectindex].entires[monthexist].Entires.push({
                date:attandancedate,
                status
              })
            }
          
          }
          else{
            console.log("first time for subject")
              tempattandance.attendance.push({
                  subjectid,
                  subjectcode,
                  subjectname,
                
                  entires:[
                  {
                    month,
                    Entires:[
                      {
                        date:attandancedate,
                        status
                      }
                    ]
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
    //console.log(typeof(month))
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
    
 /*   const attandance=subjectattandance.entires.find(entry=>entry.month===month)
    if(!attandance)
    {
      return res.status(404).json("attandance for this month is not marked yet")
      
    }
*/
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

    const {subjectcode,month}=req.body
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
        $match: { "attendance.entires.month": month} // Filter for April (month: 4)
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


// marking the attandance of the students at the current date for the subject as 'ABSENT'


module.exports = { markattandance,getattandace,getattandaceprof };
