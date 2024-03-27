const express=require('express')
const router=express.Router()
const fetchadmin=require("../middleware/adminverify")
const{registerprof}=require("../controller/professorcontroller")
//adding subject
router.route('/').post(fetchadmin,registerprof)
module.exports=router;