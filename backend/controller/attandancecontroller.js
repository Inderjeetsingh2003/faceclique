const express = require("express");
const axios = require("axios");
const { subjectcode } = require("../middleware/profsublink");
const Attandance = require("../models/Attandance");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const { Promise } = require("mongoose");

//const fucntion to calculate the distance between professor and student
const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371e3; // Radius of the Earth in meters
  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);
  const deltaLat = toRad(coords2.latitude - coords1.latitude);
  const deltaLon = toRad(coords2.longitude - coords1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
};



let professorlocation={}

  const markattandance = async (req, res) => {
    const { studentid,subjectcode, subjectname, status, attandancedate,studentlatitude,studentlongitude} = req.body;
    try {
      if (!studentid||!subjectcode || !subjectname || !status || !attandancedate||!studentlatitude||!studentlongitude) {
        return res.status(401).json(
            "unable to mark the attandance due to missing fields from frontend"
          );
      }
      const studentlocation={latitude:studentlatitude,longitude:studentlongitude}
      const storedlocation=professorlocation[subjectcode];
      console.log(storedlocation)
      if(!storedlocation||storedlocation.attandancedate!==attandancedate)
        {
          return res.status(404).send("professor location not found or date misplaced")
        }
  
const distance=haversineDistance(storedlocation,studentlocation);
console.log("distance between professor and stdudent is:",distance)
//return res.status(200).send("successfully calculated the distance")
if(distance>60)
  {
    return res.status(403).send("student is too far from the professor to mark the attandace")
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
      
      
    let tempattandance = await Attandance.findOne({
        studentrefid,
    
      });
//return res.status(200).send(tempattandance)
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
          let subjectindex=tempattandance.attendance.findIndex(entry=>entry.subjectid.equals(subjectid))
          console.log("the subject index is ",subjectindex)
            if(subjectindex===-1)
              {
                return res.status(404).json("subject does not exits for your attandance re-enrool yourself in the data base agian")
              }
              else{
                let monthentry=tempattandance.attendance[subjectindex].entires.findIndex(entry=>entry.month===month)
                console.log("the month entry is :",monthentry)
                if(monthentry===-1)
                  {
                    return res.status(300).json("everthing is wroring fine but the teacher hasnt marked your attandance yet..from his side")
                  }else{
                    let currentday=tempattandance.attendance[subjectindex].entires[monthentry].Entires.find(entry=>entry.date.toISOString().slice(0,10)===attandancedate)
                    console.log("the current date",currentday)
                      if(currentday===-1)
                        {
                          return res.status(404).json("teacher hasn't yet begin the first step of attandance")
                        }
                        else{
                          currentday.status=status
                          tempattandance.markModified('attendance')
                        }
                  }
              }

          
      }
 
      tempattandance.save()
      
        return  res.status(200).json("attandance saved succesfully")
      

    
      
      

    } catch (error) {
      console.log(error.message);
      res.status(500).json("internal server error");
    }
  };






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
const markprofsideattandace=(async(req,res)=>
{
  const{subjectcode,attandancedate,professorlatitude,professorlongitude}=req.body;
  console.log("professor latiude is:",professorlatitude)
  console.log("professor longitude is:",professorlongitude)
  const availableattandace=await Attandance.find({"attendance.subjectcode":subjectcode})
  if (!availableattandace || availableattandace.length === 0) {
    return res.status(404).json('No students found for this subject code');
}
professorlocation[subjectcode]={
  latitude:professorlatitude,
  longitude:professorlongitude,
  attandancedate

}
//return res.status(200).send(professorlocation)
//return res.send(availableattandace)
    const parsedDate = new Date(attandancedate);
      const month=parsedDate.getMonth()+1// getmonth returns 0 based indexing
      console.log("month is:",month)
      if (isNaN(parsedDate.getTime())) {
        console.log(attandancedate)
      
        return res.status(400).json("Invalid date format for attandancedate");
      }

availableattandace.map(async entry=>
  {
     let subjectattandance=entry.attendance.find(subject=>
      {
        return subject.subjectcode === subjectcode;
      }

     )
     console.log(subjectattandance)
    const monthentry=subjectattandance.entires.find(tempmonth=>{
      return tempmonth.month===month
     })
     if(monthentry)
      {
        monthentry.Entires.push({
          date:attandancedate,
          status:"absent"
        })
      }
      else{
        subjectattandance.entires.push({
          month,
          Entires:[
            {
              date:attandancedate,
              status:'absent'
            }
          ]
        })
      }
      await entry.save()
 }
  
)

return res.status(200).json("intial attandance setup done now ask student to mark from their side")

      })

module.exports = { markattandance,getattandace,getattandaceprof,markprofsideattandace};
