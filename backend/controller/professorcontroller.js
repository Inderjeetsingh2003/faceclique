const express=require('express')
const Admin=require('../models/Admin')
const registerprof=(async(req,res)=>
{
    const exuser=await Admin.findById(data.user.id)
    if(!exuser)
    {
        return res.status(400).send("unthorized")
    }
    

})