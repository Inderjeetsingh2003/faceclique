
let professorlatitude;
let professorlongitude;
let profsubid;
const professorsidedetails=(io,socket)=>
    {
        socket.on('profclick',(data)=>
        {
            console.log("the latitude of professor is:",data.professorlatitude)
            console.log("the longitude of professor is:",data.professorlongitude)
            professorlatitude=data.professorlatitude
            professorlongitude=data.professorlongitude
            profsubid=data.subid;
            console.log("the subject id is:",data.subid)
        })

       // console.log(professorlatitude," ",profsubid," ",professorlongitude)
    }
    module.exports=professorsidedetails