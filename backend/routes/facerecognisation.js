const express=require("express")
const router=express.Router()
const axios=require("axios")
const {markattandance}=require("../controller/attandancecontroller")
router.route('/').post(markattandance)

module.exports=router