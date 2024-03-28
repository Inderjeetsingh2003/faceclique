const express=require('express')
const router=express.Router()
const{createadmin}=require('../controller/admincontroller')

//crreating the admin
router.route('/').post(createadmin)
//login admin
module.exports=router