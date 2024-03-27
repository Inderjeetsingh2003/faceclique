const express=require("express")
const mongoose=require('mongoose')

mongoose.connect('mongodb+srv://rahul6005:rahul2003@cluster0.pj579.mongodb.net/faceclique').then(()=>
{
    console.log("connection is successfull")
}).catch((e)=>
{
    console.log("connection not possible",e)
})
