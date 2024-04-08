const express=require("express")
const fetchadmin=require('../middleware/adminverify')
const router=express.Router()
const {registerstudent,updatestudent}=require("../controller/studentcontroller")
router.route('/').post(fetchadmin,registerstudent)
router.route('/updatestudent/:id').put(fetchadmin,updatestudent)
module.exports=router 