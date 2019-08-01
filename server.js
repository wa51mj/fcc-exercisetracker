'use strict';

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const createUser = require('./crud/createUser');
const createExercise = require('./crud/createExercise');
const {readUserName, readId, readUsers} = require('./crud/read');
const update = require('./crud/update')
const queryLog = require('./queryLog')

// CORS
app.use(cors())


// MONGOOSE
var mongo = require('mongodb');
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected')
});

// BODY PARSER
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES
app.use(express.static('public'))
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', async function (req, res){
  console.log("new-user request");
  let response = {}
  let userName = req.body.username;
  
  // checkif user name is still available
  let userNameExists = await readUserName(userName)
  if(userNameExists) {
    // if user name aleady exists inform client
    console.log("username unavailable");
    response = {error: "requested user name unavailable"}
  } 
  else {
    // else create new user
    let newUser = await createUser(userName); 
    console.log("new user created");
    response = {userName: newUser.userName, _id: newUser._id}
  }
  console.log("response sent to client \n");
  res.json(response);
});

app.post('/api/exercise/add', async(req, res) => {
  console.log("new exercise");
  let {userId, description, duration, date} = req.body;
  date = (date)? date : new Date()
  
  let response = {}
  
  let user = await readId(userId); // check if userId exists

  if(user) {
    // if so then add exercise data
       
    user.log = user.log.concat([{description, duration, date}]) //user.log.push({description, duration, date}); results in error
    await user.save()
    console.log("exercise added")
    
    response = {userName: user.userName, _id: userId, description, duration, date}
    
  }
  else {
    response = {error: "the userId you provided does not exist"}
  }
  
  res.json(response)
});

app.get('/api/exercise/users', async(req, res) => {
  console.log("all users");
  
  let users = await readUsers() // return all users
  
  res.json(users)
});

app.get('/api/exercise/log', async(req, res) => {
  // GET /api/exercise/log?userId=hkoii&from=........
  console.log("user log request");
  
  let response = {};
  let {userId, from, to, limit} = req.query;

  // 1. check if userId exists
  let user = await readId(userId); // check if userId exists 
  
  if(user && user.log.length >= 1){
    console.log('user found');
    let logs = await queryLog(user, userId, {from, to, limit});
    response = {userName: user.userName, userId, logs};
  }
  else if(user && user.log.length === 0){
    console.log('user found but empty log')
    response = {user};
  }
  else{
    console.log('user not found')
    response = {error: 'user id not recognised'};
  }
  
  res.json(response);
});

// POST MIDDLEWARE
// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})