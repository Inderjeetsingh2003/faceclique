const express=require('express')
const router=express.Router()
const fetchadmin=require("../middleware/adminverify")
const{registersub,deletesub}=require("../controller/subjectcontroller")
//adding subject
router.route('/').post(fetchadmin,registersub)
//deleting a sub
router.route('/deletesub/:id').delete(fetchadmin,deletesub)
module.exports=router;