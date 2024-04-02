const {setonsave,emptyondelete}=require("../middleware/profsublink")
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
Profschema.post('save',setonsave)


//Profschema.post('findOneAndDelete',async function(doc)
//{
  //  let professor=doc.profId;
    //emptyondelete(professor.profId)
//}) //explectively bindling the current data

const Prof=mongoose.model("Prof",Profschema)
module.exports=Prof
