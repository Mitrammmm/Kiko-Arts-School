const UserModel = require('../models/user')

const cloudinary = require("cloudinary")

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const CourseModel = require('../models/course')

cloudinary.config({ 
    cloud_name: 'duuzlekjo', 
    api_key: '964546775877152', 
    api_secret: 'EpeiuNMw5jIwjAimZs0MYqp3u3M' 
  });
class FrontController{

    //login - static method
    static login = async (req,res)=>{
        try{
           // res.send("login page from FrontCntroller")
           res.render('login',{message:req.flash('success'),msg:req.flash('error')})
        }catch (error) {
            console.log(error)
        }
    }
    static register = async (req,res)=>{
        try{
            //res.send("home page from FrontCntroller")
            res.render('register',{message:req.flash('error')})
        }catch (error) {
            console.log(error)
        }
    }
    static home = async (req,res)=>{
        try{
            const {name,image,email,id} = req.userData;

            const btech = await CourseModel.findOne({user_id:id,course:"btech"})
            const bca = await CourseModel.findOne({user_id:id,course:"bca"})
            const mca = await CourseModel.findOne({user_id:id,course:"mca"})
            console.log(btech)

            //res.send("home page from FrontCntroller")
            res.render('home',{n:name , i:image , e:email, b:btech , bca:bca , mca:mca});
        }catch (error) {
            console.log(error)
        }
    }
    static about = async (req,res)=>{
        try{
            const {name,image} = req.userData;
            //res.send("home page from FrontCntroller")
            res.render('about',{n:name,i:image})
        }catch (error) {
            console.log(error)
        }
    }
    static contact = async (req,res)=>{
        try{
            const {name,image} = req.userData;
            //res.send("home page from FrontCntroller")
            res.render('contact',{n:name,i:image})
        }catch (error) {
            console.log(error)
        }
    }
    static userinsert = async (req,res)=>{
        try{
            // console.log(req.files.image);
            //code to upload image to cloudinary
            const file = req.files.image
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath,{
                folder:'UserProfile'
            })
            //console.log(imageUpload)
            //res.send("home page from FrontCntroller")
            // console.log(req.body)
            const {n,e,p,cp} = req.body
            const user = await UserModel.findOne({email:e})
            //console.log(user)
            if(user){
                req.flash('error','email already exist')
                res.redirect('/register')
            }
            else{
                if(n&&e&&p&&cp){
                    if(p==cp){
                        const hashpassword = await bcrypt.hash(p,10)
                        const result = new UserModel({
                            name:n,
                            email:e,
                            password:hashpassword,
                            image:{
                                public_id:imageUpload.public_id,
                                url:imageUpload.secure_url
                            }
                        })
            
                        //to save data
                        await result.save();
                        req.flash('error','reg successful please login ')
                        res.redirect('/') //route path in redirect
                    }
                    else{
                        req.flash('error','pass & conf pass does not match')
                        res.redirect('/register')
                    }
                }
                else{
                    req.flash('error','all fields are required')
                    res.redirect('/register') 
                }
            }

        }catch (error) {
            console.log(error)
        }
    }
    static verifyLogin = async (req,res)=>{
        try{
            const{email , password} = req.body
            const user = await UserModel.findOne({email:email})
            if(user!=null){
                const isMatch = await bcrypt.compare(password,user.password)

                if(isMatch){
                    //admin login
                    if(user.role == 'admin'){
                    //to generate login
                    const token = jwt.sign({ ID: user.id }, 'ethensecretkey');
                    // console.log(token)
                    res.cookie('token',token)
                    res.redirect('/admin/dashboard')
                }
                else{
                    //to generate login
                    const token = jwt.sign({ ID: user.id }, 'ethensecretkey');
                    // console.log(token)
                    res.cookie('token',token)
                    res.redirect('/home')
                }
            }
                else{
                    req.flash('error','email & pass not valid')
                    res.redirect('/') //route path in redirect
                }
            }
            else{
                req.flash('error','You are not a registered user')
                res.redirect('/') //route path in redirect
            }
        }catch (error) {
            console.log(error)
        }
    }
    //for logout
    static logout = async (req,res)=>{
        try{
            //to clear token
            res.clearCookie('token')
            res.redirect('/')
        }catch (error) {
            console.log(error)
        }
    }

    //for profile
    static profile = async (req,res)=>{
        try{
           const {name, image,email,id} = req.userData
           res.render("profile",{n:name, i:image,e:email})
        }catch {
            console.log(error)
        }
    }

    //update profile
    // static updateProfile = async (req, res) => {
        
    //     try {
    //         const { id } = req.userData
    //         const {name,email} =req.body
    //         if (req.files) {
    //             const user = await UserModel.findById(id)
    //             const imageID = user.image.public_id
    //             console.log(imageID)

    //             //deleting image from Cloudinary
    //             await cloudinary.uploader.destroy(imageID)
    //             //new image update
    //             const imagefile = req.files.image
    //             const imageupload = await cloudinary.uploader.upload(imagefile.tempFilePath, {
    //                 folder: 'userProfile'
    //             })
    //             var data = {
    //                 name: name,
    //                 email: email,
    //                 image: {
    //                     public_id: imageupload.public_id,
    //                     url: imageupload.secure_url
    //                 }
    //             }
    //         } else {
    //             var data = {
    //                 name: name,
    //                 email: email,
                    
    //             }
    //         }
    //         await UserModel.findByIdAndUpdate(id, data)
    //         req.flash('success', "Update Profile successfully")
    //         res.redirect('/profile')
            
            
    //     } catch(error) {
    //         console.log(error)
    //     }
    // }

    static updateProfile = async (req, res) => {
        try{
            // const {name,image,email,id} = req.userData;
            // console.log(req.body)
            // console.log(req.files.image)
            const { id } = req.userData
            const {name,email} =req.body
            if (req.files) {
                const user = await UserModel.findById(id)
                const imageID = user.image.public_id
                // console.log(imageID)

                //deleting image from Cloudinary
                await cloudinary.uploader.destroy(imageID)
                //new image update
                const imagefile = req.files.image
                const imageupload = await cloudinary.uploader.upload(imagefile.tempFilePath, {
                    folder: 'userProfile'
                })
                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageupload.public_id,
                        url: imageupload.secure_url
                    }
                }
            } else {
                var data = {
                    name: name,
                    email: email
                }
            }
            await UserModel.findByIdAndUpdate(id, data)
            req.flash('success', "Profile Updated successfully")
            res.redirect('/profile')
        }catch(err){
            console.log(err);
        }
    }

    //change password
    static changepassword = async (req, res) => {
        
        try {
            const {id } = req.userData
            //console.log(req.body)
            const {op,np,cp} =req.body
            if (op && np && cp) {
                const user = await UserModel.findById(id)
                const isMatched = await bcrypt.compare(op, user.password)
                //console.log(isMatched)
                if (!isMatched) {
                    req.flash('error', 'Current password is incorrect ')
                    res.redirect('/profile')
                } else {
                    if (np != cp) {
                        req.flash('error', 'Password does not match')
                        res.redirect('/profile')
                    } else {
                        const newHashPassword = await bcrypt.hash(np, 10)
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword
                        })
                        req.flash('success', 'Password Updated successfully ')
                        res.redirect('/')
                    }
                }
            } else {
                req.flash('error', 'ALL fields are required ')
                res.redirect('/profile')
            }


           
        } catch(error) {
            console.log(error)
        }
    }



}

module.exports = FrontController



