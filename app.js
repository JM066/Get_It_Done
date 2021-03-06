require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const fileUpload = require("express-fileupload");
const passportSetup = require('./config/passport-setup');

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//all the static assets will be located in client build 
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.static('public'));

app.use(session({
    secret: 'WeAreAwesome',
    resave: false,
    saveUninitialized: false
}));


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

//send all the routes to client/build/index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "client", "build", "index.html"));
});
// app.get('/*', (req, res) => {
//   let url = path.join(__dirname, '../client/build', 'index.html');
//   if (!url.startsWith('/app/')) // we're on local windows
//     url = url.substring(1);
//   res.sendFile(url);
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
