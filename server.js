
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const pug = require('pug')
const bodyparser = require('body-parser')
const flash = require ('express-flash')
const session = require ('express-session')
const methodOverride = require('method-override')
//const fs = require('fs');

const initializePassport = require('./passport-config')
const { stringify } = require('querystring')
//const loadDatabase = require("./databasemodule")
initializePassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id),
)
app.use(express.static(__dirname+'/resources'));

db_conn = __dirname + "/data/db.json";
db_schema = {
  users : [],
  videos : []
}

global.db = require(db_conn,db_schema);

let users = []
let videos = ['https://www.youtube.com/embed/k2xz9J1OqN0']

app.set('view-engine', 'pug')
app.use(express.urlencoded({ extended: false}))
app.use (flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.pug', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated,(req, res) => {
    res.render('login.pug')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/video/new_video',
  failureRedirect:'/login',
  failureFlash:true
}))

app.get('/register', checkNotAuthenticated, (req,res) =>{
  res.render('register.pug')
})

app.post('/register', checkNotAuthenticated, async (req,res) => {
  console.log (req.body)
  try{
    console.log ('message')
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
    id: Date.now().toString(),
    name:req.body.name,
    email: req.body.email,
    password: hashedPassword
  })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.get('/video/new_video', (req,res) =>{
res.render('video.pug', {videos:videos})
})

app.post('/video/new_video', (req,res) => {
  console.log (req.body)
  video=req.body.VideoLink
  console.log (video)
  videos.push(video)
  res.render('videosuccess.pug', {videos:videos})
  // //try{
  //   const hashedPassword = await bcrypt.hash(req.body.password, 10)
  //   users.push({
  //     id: Date.now().toString(),
  //     name:req.body.name,
  //     email: req.body.email,
  //     password: hashedPassword
  //   })

  //   res.redirect('/videosuccess.pug')
  // } catch {
  //   res.redirect('/login')
//   }
})

app.get('/logout', (req, res) =>{
  req.logout(function(err){
    if (err){return next(err)}
    res.redirect('login')
  })
})

function checkAuthenticated(req,res, next){
  if (req.isAuthenticated()){
    return next ()
  }

  res.redirect ('/')
}

function checkNotAuthenticated(req, res, next){ 
  if (req.isAuthenticated()){
  return res.redirect('/login')
}
next()
}

app.listen(3000)
