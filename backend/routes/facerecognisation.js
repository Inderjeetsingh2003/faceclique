const express=require("express")
const router=express.Router()
const axios=require("axios")
router.get('/',async(req,res)=>
{
    try{

        const respose=await axios.get('http://127.0.0.1:5001/recognize')
        console.log(respose.data.message)
        console.log('Recognized faces:', respose.data.recognized_face);
        return res.status(200).send(respose.data.message)

    }
    catch(error)
    {
        console.log("unable to run the face recoginastion algorithm")
        console.log(error.message)
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports=router