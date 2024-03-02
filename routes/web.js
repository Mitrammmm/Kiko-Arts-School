const express = require("express")
const FrontController = require("../controllers/FrontController")
const route = express.Router()
const checkUserAuth = require('../middleware/auth')
const CourseController = require("../controllers/CourseController")
const AdminController = require("../controllers/AdminController")

//routing
// route.get('/',(req,res)=>{
//     res.send("HOME page from web")
// })
// route.get('/about',(req,res)=>{
//     res.send('About from web')
// })

//routing to FrontController
route.get('/',FrontController.login)
route.get('/register',FrontController.register)
// route.get('/home',FrontController.home)
route.get('/home',checkUserAuth,FrontController.home)
route.get('/about',checkUserAuth,FrontController.about)
route.get('/contact',checkUserAuth,FrontController.contact)

route.post('/userinsert',FrontController.userinsert)
route.post('/verifyLogin',FrontController.verifyLogin)
route.get('/logout',FrontController.logout)

//profile
route.get('/profile',checkUserAuth,FrontController.profile)
route.post('/updateProfile',checkUserAuth,FrontController.updateProfile)

// to change password
route.post('/changepassword',checkUserAuth,FrontController.changepassword)

//route to course
route.post("/course_insert",checkUserAuth,CourseController.courseInsert)
route.get("/course_display",checkUserAuth,CourseController.courseDisplay)
//route for course view
route.get("/courseView/:id",checkUserAuth,CourseController.courseView)
//edit & update
route.get("/courseEdit/:id",checkUserAuth,CourseController.courseEdit)
route.post("/courseUpdate/:id",checkUserAuth,CourseController.courseUpdate)
// delete
route.get("/courseDelete/:id",checkUserAuth,CourseController.courseDelete)

//for admin
route.get("/admin/dashboard",checkUserAuth,AdminController.dashboard)
route.post("/update_status/:id",checkUserAuth,AdminController.update_status)



module.exports = route;
