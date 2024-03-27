const express=require('express')
const bcrypt=require('bcrypt')
const Admin=require('../models/Admin.js')
const jwt=require('jsonwebtoken')
const ACCESS_TOKEN_SECRET="facecliqueproject"
//@desc register the admin
//@route POST/admin/
//@access Public
const createadmin=(async(req,res)=>
{
    try{

        
        const{fullname,email}=req.body
        const exuser=await Admin.findOne({email})
        if(exuser)
        {
           return res.status(400).send("the user already exists")
        }
        const salt=await bcrypt.genSalt(10);
        const haspass=await bcrypt.hash(req.body.password,salt);
        const user=new Admin({
            fullname,email,password:haspass
        })
        await user.save()
        const data={
            user:{
                id:user.id
            }
        }
        const accesstoken=await jwt.sign(data,ACCESS_TOKEN_SECRET)
        return res.status(200).send(accesstoken)
    }
    catch(e)
    {
        console.log(e.message)
        return res.status(500).send("internal server error occured")
    }

})

module.exports={createadmin}