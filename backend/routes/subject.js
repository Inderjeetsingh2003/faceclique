const express=require('express')
const router=express.Router()
const fetchadmin=require("../middleware/adminverify")
const{registersub}=require("../controller/subjectcontroller")
//adding subject
router.route('/').post(fetchadmin,registersub)
module.exports=router;