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

// Allow requests from your Netlify frontend
app.use(cors({
    origin: "https://eduquest-guide1.netlify.app",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization,Accept,X-Requested-With",
    credentials: true
}));

// Ensure `Access-Control-Allow-Credentials` is always set
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

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
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://gul-muhammad:n9E7xTwwmpvJB1qg@eduquest.qandv.mongodb.net/?retryWrites=true&w=majority&appName=EduQuest/eduquest',
    collectionName: 'sessions'
  }),
    cookie: {
        secure: true,
        httpOnly: false, // Protect against XSS
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week 
        domain: 'eduquest-guide1.netlify.app' // Crucial for subdomains
    }
}));

app.use(passport.initialize());
app.use(passport.session());



//      JWT MIDDLEWARE


const jwtAuthMiddleware = (req, res, next) => {
  if (req.user) {
      return next();
  }
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
      if (err) {
          // Handle error if needed (e.g., log it)
          console.error('Authentication Error:', err);
          return next(err); // Pass the error to the next middleware
      }

      if (!user) {
          // Handle the case where the user is not found
          // For example, you might want to populate req.user with null
          req.user = null;
          return next(); // Continue to the next middleware or route handler
      }

      // Authentication succeeded; populate req.user
      req.user = user;
      next(); // Continue to the next middleware or route handler
  })(req, res, next);
};

// Use the custom JWT middleware globally
app.use(jwtAuthMiddleware);


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
