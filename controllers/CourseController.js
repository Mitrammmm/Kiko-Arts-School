const CourseModel =require('../models/course')

const nodemailer = require('nodemailer')

class CourseController{
    static courseInsert =async(req,res)=>{
        try{
            //console.log(req.body)
            const {id} = req.userData
            const {name,email,phone,dob,address,gender,education,course} =req.body
            const result =new CourseModel({
                name:name,
                email:email,
                phone:phone,
                dob:dob,
                address:address,
                gender:gender,
                education:education,
                course:course,
                user_id:id
            })
            await result.save()
            this.sendEmail(name,email,course)
            res.redirect("/course_display")
        }
        catch (errer) {
            console.log(error)
        }
    }
    
    static courseDisplay =async(req,res)=>{
        try{
            const {name,image,id} =req.userData
            const data =await CourseModel.find({user_id:id})
            //console.log(data)
            res.render('course/display',{n:this.name,i:image,d:data,msg:req.flash("success")})
        }
        catch(error){
            console.log(error)
        }
    }

    static courseView =async(req,res)=>{
        try{
            //console.log(req.params.id)
            const {name,image} =req.userData
            const data =await CourseModel.findById(req.params.id)
            //console.log(data)
            res.render('course/view',{n:this.name,i:image,d:data})
        }
        catch(error){
            console.log(error)
        }
    }

    static courseEdit =async(req,res)=>{
        try{
            //console.log(req.params.id)
            const {name,image} =req.userData
            const data =await CourseModel.findById(req.params.id)
            //console.log(data)
            res.render('course/edit',{n:this.name,i:image,d:data})
        }
        catch(error){
            console.log(error)
        }
    }

    static courseUpdate =async(req,res)=>{
        try{
            //console.log(req.body)
            // //console.log(req.params.id)
            const {name,email,dob,address,gender,education,course} =req.body
            const {image} =req.userData
            await CourseModel.findByIdAndUpdate(req.params.id,{
                name:name,
                email:email,
                phone:phone,
                dob:dob,
                address:address,
                gender:gender,
                education:education,
                course:course
            })
            //console.log(data)
            req.flash('success','course updated successfully!!')
            res.redirect('/course_display')
        }
        catch(error){
            console.log(error)
        }
    }

    static courseDelete =async(req,res)=>{
        try{
            //console.log(req.params.id)
            const {name,image} =req.userData
            await CourseModel.findByIdAndDelete(req.params.id)
            //console.log(data)
            req.flash('success','Course Deleted Successfully')
            res.redirect('/course_display')
        }
        catch(error){
            console.log(error)
        }
    }

    static sendEmail = async (name,email,course) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",  //gmail k host type h 
            port: 587,

            auth: {
                user: "meramail@gmail.com",
                pass: "uskapassword",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: ` Course ${course}`, // Subject line
            text: "heelo", // plain text body
            html: `<b>${name}</b> Course  <b>${course}</b> Successfully Inserted :) <br> `, 
        });
    };
}
module.exports =CourseController