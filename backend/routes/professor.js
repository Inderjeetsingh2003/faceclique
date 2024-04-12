const express=require('express')
const router=express.Router()
const fetchadmin=require("../middleware/adminverify")
const{registerprof,deleteprof,getprofsub,proflogin}=require("../controller/professorcontroller")
//creating professor
router.route('/').post(fetchadmin,registerprof)
//deleeting the professor
router.route('/deleteprof/:id').delete(fetchadmin,deleteprof)
router.route('/getprof').get(fetchadmin,getprofsub)

router.route('/login').post(proflogin)
module.exports=router;