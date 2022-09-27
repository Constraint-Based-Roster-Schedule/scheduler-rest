const express = require('express') ;
const mongoose = require('mongoose') ;
const httpError = require('http-errors') ;
const path = require('path') ;

const userRouter = require('./routes/user');
const wardRouter = require('./routes/ward');
const indexRouter = require('./routes/index');
const testRouter = require('./routes/testAPI');



var app = express() ;
const port = 5000 ;

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/testAPI', testRouter) ;



app.listen(port, () => {
    console.log("Starting server on port " + port) ;
} ) ;





module.exports = app 