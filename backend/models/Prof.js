const { default: mongoose } = require('mongoose')
const mongoose=require('mongoose')
const profschema=new mongoose.Schema({
    name:{
        type:String,
        reqired:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    
})