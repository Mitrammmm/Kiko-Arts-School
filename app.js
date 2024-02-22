const express = require('express')
//console.log(express)
const app = express()
const port = 3000
const web = require("./routes/web")
const connectDb = require("./db/dbcon")

//cookie
const cookieparser = require('cookie-parser')
app.use(cookieparser()) //used to get token

//express file uploader
const fileUpload = require('express-fileupload')

//Temp Files Uploader
app.use(fileUpload({useTempFiles:true}))

//connect flash and sessions
const session = require('express-session')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')

//messages
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }));
//Flash messages
app.use(flash());


//to get data as object!
app.use(express.urlencoded({extended:false}))

//connection to database
connectDb()

//template engine (html css)
app.set('view engine','ejs')

//to link css& img folder from PUBLIC
app.use(express.static('public'))

//route(means path) :
//localhost:3000('/)
// app.get('/',(req,res)=>{
//     res.send('Home Page')
// })
// //localhost:3000/about
// app.get('/about',(req,res)=>{
//     res.send('About Page')
// })
// //localhost:3000/team
// app.get('/team',(req,res)=>{
//     res.send('Team Page')
// })


//sending main page'/' to other 'web' page
app.use('/',web)

//create server
app.listen(port, () => console.log('Hello Server'))



