
const mongoose=require('mongoose')
const Profschema=new mongoose.Schema({
    
    profId:
    {
        type:String,
        required:true,
    },
    
    name:{
        type:String,
        reqired:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    subjects:[{
       type:String,
       unique:true,
       required:true
    }],

    department:{
       type:String,
       required:true,
    }
    
})
const Prof=mongoose.model("Prof",Profschema)
module.exports=Prof
