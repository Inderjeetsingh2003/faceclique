const express=require("express")
const fetchadmin=require('../middleware/adminverify')
const router=express.Router()
const {registerstudent,updatestudent, getstudent,studentlogin}=require("../controller/studentcontroller")
router.route('/').post(fetchadmin,registerstudent)
router.route('/updatestudent/:id').put(fetchadmin,updatestudent)
router.route('/getstudent/:id').get(getstudent)
router.route('/login').post(studentlogin)

module.exports=router 