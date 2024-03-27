const express=require('express')
const jwt=require("jsonwebtoken")
const ACCESS_TOKEN_SECRET="facecliqueproject"   
const fetchadmin=(req,res,next)=>
{
    

        const token=res.header('action-token')
        if(!token)
        {
            return res.status(401).send("invalid token")
        }
        try{

            const data=jwt.verify(token,ACCESS_TOKEN_SECRET)
            
            next()
        }

    catch(error)
    {
        console.log(error.message)
        return res.status(401).send("token is not valid")
    }

}
module.export=fetchadmin;