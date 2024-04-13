const express=require("express")
const router=express.Router()
const axios=require("axios")
const {markattandance,getattandace}=require("../controller/attandancecontroller")
const fetchadmin=require('../middleware/adminverify')
router.route('/markattandance').post(markattandance)
router.route('/getstudentattandance').post(fetchadmin,getattandace)

module.exports=router