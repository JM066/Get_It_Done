require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const fileUpload = require("express-fileupload");
// const passportSetup = require('./config/passport-setup');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth-routes');
const profileRouter = require('./routes/profile-routes');
const serviceRouter = require('./routes/service-routes');
const usersRouter = require('./routes/user-routes');
const imageRouter = require('./routes/images');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.set('port', (process.env.PORT || 5000));
//send all the routes to client/build/index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
//For avoidong Heroku $PORT error
// app.get('/', function(request, response) {
//     var result = 'App is running'
//     response.send(result);
// }).listen(app.get('port'), function() {
//     console.log('App is running, server is listening on port ', app.get('port'));
// });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
//all the static assets will be located in client build 
app.use(express.static(path.join(__dirname, '/client/build')));

//Initialise passport
app.use(passport.initialize());
app.use(passport.session());

// SET UP ROUTES
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/services', serviceRouter);
app.use('/users', usersRouter);
app.use("/images", imageRouter);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp",
  })
)

app.use(express.static('public'));
// app.get('/', (req,res) => {
//     // res.render('home');
//     res.send("Welcome to the backend");
//     // res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
