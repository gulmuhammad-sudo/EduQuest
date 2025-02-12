var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var cors = require('cors');  
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var universityRouter = require('./routes/universities');
var chatRouter = require('./routes/chats');
var passportConfig = require('./passportConfig');

const { populateUniversity }  = require('./faker/university');
const { populateUser } = require('./faker');

var app = express();

mongoose.connect('mongodb+srv://gul-muhammad:n9E7xTwwmpvJB1qg@eduquest.qandv.mongodb.net/?retryWrites=true&w=majority&appName=EduQuest/eduquest').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

passportConfig(passport);

//populateUniversity();
populateUser();

//app.use(cors({
//  origin: '*', 
//  credentials: true, 
//}));

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Session setup with MongoDB store
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://gul-muhammad:n9E7xTwwmpvJB1qg@eduquest.qandv.mongodb.net/?retryWrites=true&w=majority&appName=EduQuest/eduquest',
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 180 * 60 * 1000 } 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/university', universityRouter);
app.use('/chat', chatRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

module.exports = app;
