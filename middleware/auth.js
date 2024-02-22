const jwt = require('jsonwebtoken')

const UserModel = require('../models/user')

const checkUserAuth = async(req,res,next)=>{
    //console.log('hello middlewareeeeee')
    const{token} = req.cookies
    //console.log(token)
    if(!token){
        req.flash('error','unauthorized user please login')
        res.redirect('/')
    }
    else{
        const verifyLogin = jwt.verify(token,'ethensecretkey')
        //console.log(verifyLogin)
        const data = await UserModel.findOne({_id:verifyLogin.ID})
        //console.log(data)
        req.userData = data
        next();
    }
}

module.exports = checkUserAuth;