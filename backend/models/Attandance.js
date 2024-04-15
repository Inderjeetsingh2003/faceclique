const mongoose=require('mongoose')
const { type } = require('os')

const entryschema= new mongoose.Schema
({
    date:{
        type:Date,
        
    },
    status:{
        type:String,
      
    }
})





const subjectattandanceSchema= new mongoose.Schema(
    {
       subjectid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
       },
       subjectcode:{
        type:String
       },
       subjectname:{
        type:String,
        
       },
       entires:[entryschema]
       

    }
)

const attandanceschema=new mongoose.Schema({
    studentrefid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    studentid:{
        type:String,
       required:true
    },
    attendance:[subjectattandanceSchema]
})
const Attandance=mongoose.model('Attandance',attandanceschema)

module.exports=Attandance;
