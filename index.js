const express = require('express') ;
require("dotenv").config();
const mongoose = require('mongoose') ;
const httpError = require('http-errors') ;
const path = require('path') ;


const cors = require('cors');
require("dotenv").config();//..........................

const connection = require('./connection.js')

const userRouter = require('./routes/user');
const wardRouter = require('./routes/ward');
const indexRouter = require('./routes/index');
const testRouter = require('./routes/testAPI');
const auth_router = require('./routes/auth_router')
const doctorRouter=require('./routes/userDoctorRouter');
//get auth tokens
const doctorAuthToken=require('./middleware/doctorAuthToken');


/* connect to database */
const connector = new connection() ;
mongoose.connect (connector.getURL())
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


var app = express() ;
const port = 5000 ;

/* middleware */
app.use(cors());
app.use(express.json());

/* main routes */
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/testAPI', testRouter) ;
app.use('/auth',auth_router);
app.use('/doctor',doctorAuthToken, doctorRouter);

app.listen(port, () => {
    console.log("Starting server on port " + port) ;
} ) ;





module.exports = app 