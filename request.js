let n=require('readline-sync');
let fs=require('fs')
const axios = require('axios');

saral_data=axios.get("http://saral.navgurukul.org/api/courses")
    .then(resp => {
    let api_info=resp.data
    let file=JSON.stringify(api_info,null,4)
    fs.writeFileSync("courses.json",file)
    let serial=1
    let course_list=[]
    for (let course of api_info["availableCourses"]){
        console.log(`${serial}`,course["name"]+" "+course["id"])
        course_list.push(course["name"])
        serial++
    }
    let course_name=n.questionInt("enter serial id of course do you want to open:-");
    console.log(`${course_name}`,api_info["availableCourses"][course_name-1]["name"])
    let url2=axios.get("http://saral.navgurukul.org/api/courses/"+String(api_info["availableCourses"][course_name-1]["id"])+"/exercises")
    .then(resp=>{
        let api2=resp.data
        let file2=JSON.stringify(api2,null,4)
        fs.writeFileSync("parent.json",file2)
        serial2=1
        serial3=1
        let topic_list=[]
        for (let parent of api2["data"]){
            if (parent["childExercises"].length==0){
                console.log("     ",serial2,parent["name"])
                topic_list.push(parent["name"])
                console.log("           "+serial3,parent["slug"])
                serial2++
            }else{
                let serial_no=1
                console.log("     ",serial2,parent["name"])
                topic_list.push(parent["name"])
                for (questions of parent["childExercises"]){
                console.log("            ",serial_no,questions["name"])
                serial_no++
                }
                serial2++
            }
        
        }
        let slug=n.questionInt("enter the parent number:-")
        k=topic_list[slug-1]
        console.log("       ",slug,topic_list[slug-1])
        for (let i of api2["data"]){
            if (i["name"]===k){
                if (i["childExercises"].length==0){
                    s_no=1
                    console.log("     ",s_no,"-",api2["data"][slug-1]["slug"])
                
                    ques=n.questionInt("enter slug number:-")
                    new_one=axios.get(("http://saral.navgurukul.org/api/courses/"+String(api_info["availableCourses"][course_name-1]["id"])+"/exercise/getBySlug?slug="+String(api2["data"][slug-1]["slug"])))
                .then(resp=>{
                        let api4=resp.data
                        let file4=JSON.stringify(api4,null,4)
                        fs.writeFileSync("question1.json",file4)
                        console.log(api4["content"])
                })
                    break
                }
                else{
                    s=1
                    for (index of api2["data"][slug-1]["childExercises"]){
                        console.log("        ",s,index["name"])
                        s++
                    }
                    ques=n.questionInt("enter question number:-")
                    info=axios.get("http://saral.navgurukul.org/api/courses/"+String(api_info["availableCourses"][course_name-1]["id"])+"/exercise/getBySlug?slug="+String(api2["data"][slug-1]["childExercises"][ques-1]["slug"]))
                    .then(resp=>{
                        let api3=resp.data
                        let file3=JSON.stringify(api3,null,4)
                        fs.writeFileSync("question.json",file3)
                        console.log(api3["content"])
                    })
                }
            }}
    })
})
