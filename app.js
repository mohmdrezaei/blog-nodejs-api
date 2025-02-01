const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose')
const User =require("./models/User")
const bcrypt = require('bcryptjs');
const jwt =require("jsonwebtoken")

const secret = "dfre58439uihrjgyui3y4ui"
const salt = bcrypt.genSaltSync(10);
app.use(cors({credentials : true , origin :"http://localhost:3000"}));
app.use(express.json());

const dbURI =
  "mongodb+srv://mohammad:12345@cluster0.rvsiu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI);

app.post("/register", async(req, res) => {
  const { username, password } = req.body;
 const userDoc = await User.create({
    username ,
     password : bcrypt.hashSync(password, salt)
})
  res.json(userDoc);
});

app.post("/login" , async(req , res)=>{
  const {username , password } = req.body
  const userDoc =await User.findOne({username})
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if(passOk){
    jwt.sign({username ,  id:userDoc._id} , secret ,(err , token)=>{
    if(err) throw err
    res.cookie("token" , token).json("ok")
   })
  

  }else{
    res.status(400).json("wrong credentials")
  }
})

app.get("/", (req, res) => {
  res.send("welcome to blog API");
});
app.listen(6500);
