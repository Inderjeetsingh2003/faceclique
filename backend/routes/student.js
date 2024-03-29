const express=require("express")
const fetchadmin=require('../middleware/adminverify')
const router=express.Router()
const {registerstudent}=require("../controller/studentcontroller")
router.route('/').post(fetchadmin,registerstudent)

module.exports=router