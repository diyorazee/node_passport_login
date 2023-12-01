const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Passport Config
require('./config/passport.js')(passport);

//db config
const db = require('./config/key.js').MongoURI;

//connect to mongodb
mongoose.connect(db, { useNewUrlParser: true } )
    .then(() => console.log("MongoDB is Connected!!!"))
    .catch(err => console.log(err));

//ejs middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');

//body-parser middleware 
app.use(express.urlencoded({ extended : false }));

//connect-flash middleware
app.use(flash());

//sessions middleware
app.use(session({
    secret: 'secretMiddleware',
    resave: true,
    saveUninitialized: true,
  }))  

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//some global variable
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})  

const PORT = process.env.PORT || 5001;

//routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

app.listen(PORT, console.log(`Server started on ${PORT}`));