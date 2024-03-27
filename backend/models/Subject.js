const mongoose=require("mongoose")
const subjectschema=new mongoose.Schema({
    subjectcode:{
        type:String,
        required:true
    },
    subjectname:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true

    },
    semester:{
        type:String,
        required:true
    },
    teahcer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'prof'
    }
   
},{
    
        timestamps:true
    
})

const Subject=mongoose.model("subject",subjectschema)
module.exports=Subject