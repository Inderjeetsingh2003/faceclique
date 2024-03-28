const express=require('express')
const router=express.Router()
const fetchadmin=require("../middleware/adminverify")
const{registerprof,deleteprof}=require("../controller/professorcontroller")
//creating professor
router.route('/').post(fetchadmin,registerprof)
//deleeting the professor
router.route('/deleteprof/:id').delete(fetchadmin,deleteprof)
module.exports=router;