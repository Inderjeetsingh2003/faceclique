const express=require('express')
const router=express.Router()
const{fetchadmin}=require("../middleware/adminverify")
router.route('/').post(adminverify,)