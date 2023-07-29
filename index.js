//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _= require('lodash');
const ejs = require("ejs");
const LocalStorage = require("node-localstorage").LocalStorage
localStorage = new LocalStorage("./scratch")
const cookieparser = require('cookie-parser')
const mongoose=require("mongoose");
const cookieParser = require("cookie-parser");
mongoose.connect('mongodb+srv://ravisai189:o0ad2pKr2Xt6K7Uo@cluster0.pxlyy1u.mongodb.net/blogwebsite');


const homeStartingContent ="Step into a world of limitless possibilities and boundless imagination. Daily Journal is your gateway to a diverse universe of ideas, stories, and inspirations that will expand your horizons and leave you craving for more. Whether you're an avid reader, an aspiring writer, or simply seeking a digital sanctuary, we're thrilled to have you join our ever-growing community.";
const aboutContent = ""
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const itemSchema=new mongoose.Schema({
  title:String,
  sodhi:String
})

const userschema = new mongoose.Schema({
  mail:String,
  password:String,
})
const item=mongoose.model("item",itemSchema)
const user=mongoose.model("user",userschema)

const app = express();
let posts=[]

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieparser())
app.get("/about",function(req,res){
  var k=req.cookies.Userstatus
  res.render("about.ejs",{aboutcontent:aboutContent,main:k})
})
app.get("/contact",function(req,res){
  var k=req.cookies.Userstatus
  res.render("contact.ejs",{contactcontent:contactContent,main:k})
})
app.get("/compose",function(req,res){
  var k=req.cookies.Userstatus
  res.render("compose.ejs",{main:k})
})
app.get("/signup",function(req,res){
  res.render("signup.ejs")
})
app.get("/",function(req,res){
  
  item.find({},function(err,d){
    if(!err){
      var k=req.cookies.Userstatus
        res.render("home",{homecontent:homeStartingContent,posts:d,main:k})
    }
  })
})
app.get("/login",function(req,res){
  res.render("login.ejs")
})
app.get("/posts/:id",function(req,res){
  var k=req.cookies.Userstatus
  const idd=req.params.id
  item.findById(idd,function(err,d1){
    if(!err){
      res.render("post",{title:d1.title,content:d1.sodhi,id:idd,main:k})
    }
  })
})
app.get("/header",function(req,res){
  item.find({},function(err,d){
    if(!err){
      var k=req.cookies.Userstatus
      console.log(k)
        res.render("header",{homecontent:homeStartingContent,posts:d,main:k})
    }
  })
})
app.get("/logout", (req, res) => {
  var k = req.cookies.Userstatus;
  localStorage.removeItem(k);
  res.clearCookie("User status");
  res.redirect('/')
})
app.post("/delete/:id",function(req,res){
  const idd=req.params.id
  item.findByIdAndRemove(idd,function(err){
    if(!err){
      res.redirect("/")
    }
  })
})
app.post("/signup",function(req,res){
  const email=req.body.email
  const p=req.body.password
  const p1=req.body.password1
  
  user.findOne({mail:email},function(err,d){
    if(d){
      res.redirect("/login")
    }
    else{
      console.log("asdfg")
      if(p==p1){
        const user1=new user({
          mail:req.body.email,
          password:req.body.password
        })
        user1.save()
        res.redirect("/login")
      }
      else{
        res.json("Password doesn't match")
      }
    }
  })



})

app.post("/login",function(req,res){
  const m=req.body.email
  const p=req.body.password

  user.findOne({mail:m},function(err,d){
    if(!d){
      res.redirect("/signup")
    }
    else{
      if(p==d.password){
        res.cookie("Userstatus",m)
        var k = req.cookies.Userstatus;
        console.log(k)
        localStorage.setItem(m, JSON.stringify(d))
        res.redirect("/")
      }
      else{
        res.json("Enter correct password")
      }
    }
  })

})

app.post("/compose",function(req,res){
  const item1=new item({
    title:req.body.title,
    sodhi:req.body.Postdata
  })
  item1.save()
  res.redirect("/")
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
