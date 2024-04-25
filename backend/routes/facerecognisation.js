const express=require("express")
const router=express.Router()
//const axios=require("axios")
const {markattandance,getattandace,getattandaceprof}=require("../controller/attandancecontroller")
const fetchadmin=require('../middleware/adminverify')
router.route('/markattandance').post(markattandance)
router.route('/getstudentattandance').post(fetchadmin,getattandace)
router.route('/getprofessorattandance').post(getattandaceprof)

module.exports=router