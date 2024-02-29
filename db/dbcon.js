const mongoose=require('mongoose')
const liveUrl = 'mongodb+srv://saumitrapahalvan:mitra11@cluster0.nm5xebz.mongodb.net/AdmissionPortall?retryWrites=true&w=majority&appName=Cluster0'
const localUrl = 'mongodb://127.0.0.1:27017/admission'

const connectDb=()=>{
    return mongoose.connect(liveUrl)
    .then(()=>{
        console.log("connected to MongoDb");
    }).catch((err)=>{
        console.log(err);
    })
}
module.exports = connectDb