const express=require("express")
const Student=require('../models/Student')
const Subject=require('../models/Subject')
const {addstud,updatestu}=require("../middleware/profsublink")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const TOKEN_SECRET="INDERJEET SINGH"

//registering the student
const registerstudent=(async(req,res)=>
{
    const{name,email,studentid,department,semester,password}=req.body
    try{
    const exstudent=await Student.findOne({studentid})
    if(exstudent)
    {
        return res.status(200).json({error:"student already exists"})
    }

    const salt=await bcrypt.genSalt(10)
    const hashpassword=await bcrypt.hash(password,salt)

   const newstudent=new Student({
        name,email,studentid,department,semester,password:hashpassword
    })
    addstud(newstudent.semester,newstudent.department)
   await newstudent.save()
   console.log({department, semester})

   console.log("Student");
        const subjects = await Subject.find({ department: department, semester: semester });
        console.log(subjects);

        // Extract subject codes from fetched subjects
        const subjectCodes = subjects.map(subject => subject._id);

        // Update students matching department and semester
        await Student.updateMany(
            { department: department, semester: semester },
            { $addToSet: { subjectcode: { $each: subjectCodes } } }
        );

        console.log("Students subjects updated successfully");
       
    return res.status(200).send("student saved successfully")
}
catch(error)
{
    console.log(error.message)
    res.status(500).send("student data did not saved")
}
})


const updatestudent=(async(req,res)=>
{
    const{newsemester}=req.body
    try{

        const exstu= await Student.findById(req.params.id)
        console.log(exstu)
        if(!exstu)
        {
            return res.status(404).send("no such user exits")
        }
            const subject_id= await updatestu(exstu.semester,exstu.department,newsemester)
            await Student.findByIdAndUpdate(req.params.id,{semester:newsemester,subjectcode:subject_id})
            return res.status(200).send("student updated successully")
    }
    catch(error)
    {
        console.log("unable to update the student")
        console.log(error.message)

    }

})

const getstudent=(async(req,res)=>{

    try {
    

    const student= await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).send("Student not found");
    }
    
    const subjectcode=student.subjectcode;

    const subjectNames = [];

        for (let i = 0; i < subjectcode.length; i++) {
            const subjectId = subjectcode[i];
            try {
                const subject = await Subject.findById(subjectId);
                // console.log(subject)
                const subjectName = subject ? subject.subjectname : null;
                subjectNames.push(subjectName);
            } catch (error) {
                console.error(`Error fetching subject with ID ${subjectId}:`, error);
                subjectNames.push(null);
            }
        }

        console.log(subjectNames);


    return res.status(200).send(subjectNames)
   
}
catch(error){
    console.log(error.message)
}
})


const studentlogin=(async(req,res)=>
{
    let success;
    try{
        const{studentid,password}=req.body
        console.log(studentid,password)
        const student=await Student.findOne({studentid})
        if(!student)
        {
            return res.status(404).json({error:"invalid credintals"})
        }
        const comparepassword=await bcrypt.compare(password,student.password)
        if(!comparepassword)
        {
            return res.status(404).json({error:"invalid credintals"})
    
        }
        const data={
            student:{
                id:student.id
            }
        }
    const accesstoken=await jwt.sign(data,TOKEN_SECRET)
    success=true
    return res.status(200).json({success,accesstoken})
    }
    catch(error)
    {
        console.log("invalid to login")
        console.log(error.message)
        return res.status(500).json("internal server error")
    }
   
    
})
module.exports={registerstudent,updatestudent, getstudent,studentlogin}