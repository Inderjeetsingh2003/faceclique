const express = require("express");
const axios = require("axios");
const { subjectcode } = require("../middleware/profsublink");
const Attandance = require("../models/Attandance");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const markattandance = async (req, res) => {
  const { subjectcode, subjectname, status, attandancedate } = req.body;
  try {
    if (!subjectcode || !subjectname || !status || !attandancedate) {
      return res
        .status(401)
        .send(
          "unable to mark the attandance due to missing fields from frontend"
        );
    }
    const response = await axios.get("http://127.0.0.1:5001/recognize");
    console.log(response.data.message);
    console.log("Recognized faces:", response.data.recognized_face);
    console.log(subjectcode, subjectname, status, attandancedate);

    //fething the correspondingdata to from the Subejct and Student schema
    const student = await Student.findOne({
      studentid: response.data.recognized_face,
    });  
    if (!student) {
      res 
        .status(404)
        .send(
          "student not found,please add the student before taking attandance"
        );
    }
    const studentrefid = student._id;
    console.log("the student id is:", studentrefid);
    const subject = await Subject.findOne({
      subjectcode,
    });
    if (!subject) {
      res
        .status(404)
        .send(
          "subject not found please add the subject before marking the attandace"
        );
    }
    const subjectid = subject._id;
    console.log("subjectid is:", subjectid);

    //handiling the date part
    const [year, month, day] = attandancedate.split("-");
    const parseddate = new Date(year, month, day);
    if (isNaN(parseddate.getTime())) {
      res.status(400).send("date is not valid ");
    }
    parseddate.setHours(0, 0, 0, 0);

    //checking if there is alreay an entry for the sujectid for the current student

   let tempattandance = await Attandance.findOne({
      studentrefid,
  
    });

    if (!tempattandance) {
        tempattandance = new Attandance({
        studentrefid,
        studentid: response.data.recognized_face,
        attendance: [
          {
            subjectid,
            subjectcode,
            subjectname,
            entires: [
              {
                date: parseddate,
                status,
              },
            ],
          },
        ],
      });
    }else{
        let subjectindex= tempattandance.attendance.findIndex(entry=>entry.subjectid.equals(subjectid))
        if(subjectindex!==-1)
        {
            tempattandance.attendance[subjectindex].entires.push({
                date:parseddate,
                status
            })
        }
        else{
            tempattandance.attendance.push({
                subjectid,
                subjectcode,
                subjectname,
                entires:[
                    {
                        date:parseddate,
                        status
                    }
                ]
            })
        }

        
    }
        res.status(200).send("attandance saved succesfully")
        tempattandance.save()
    

  
     // res.status(200).send("Attendance saved successfully");

  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal server error");
  }
};

module.exports = { markattandance };
