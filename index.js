const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const multer=require('multer')
const path = require('path')
const bodyParser = require('body-parser')
const authRoute = require('./routes/auth')
const Motorroute = require('./routes/bus')
const Paystack = require('./routes/paystack')





dotenv.config()

const app = express()

mongoose.connect(
    process.env.Mongokey
    ).then(()=> console.log('connected to db'))
    .catch((err) => {
        console.log(err)
    })

const corsOptions = {
    origin: "https://travel-app-will.vercel.app",
    "Access-Control-Allow-Credentials": true,
};
app.use(cors(corsOptions));

app.use(express.json())

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        fn(null,req.body.img)
        // fn(null,"image1.jpg")
    }
})

app.use("/images",express.static(path.join(__dirname,"/images")))
app.use('/api', authRoute)
app.use('/api', Motorroute)
app.use('/api', Paystack)


const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})




app.listen(4000, function () {
    console.log('server running')
})