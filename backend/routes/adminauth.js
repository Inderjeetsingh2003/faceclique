const express=require('express')
const router=express.Router()
const{createadmin}=require('../controller/admincontroller')
router.route('/').post(createadmin)
module.exports=router