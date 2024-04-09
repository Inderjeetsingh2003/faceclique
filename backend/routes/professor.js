const express=require('express')
const router=express.Router()
const fetchadmin=require("../middleware/adminverify")
const{registerprof,deleteprof,getprof}=require("../controller/professorcontroller")
//creating professor
router.route('/').post(fetchadmin,registerprof)
//deleeting the professor
router.route('/deleteprof/:id').delete(fetchadmin,deleteprof)
router.route('/getprof/:id').get(getprof)
module.exports=router;