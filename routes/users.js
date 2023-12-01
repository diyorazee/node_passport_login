const express = require('express');
const routes = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//user model
const User = require('../models/User');

//login page
routes.get('/login',(req, res)=>{res.render('login')});

//registration page
routes.get('/register',(req, res)=>{res.render('register')});

routes.post('/register',(req, res)=>{
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //validaition passed
    User.findOne({ email: email })
      .then(user => {
        if(user){
          //user exists 
          errors.push({ msg: 'email already registered'});
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          })

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'you are now registered and log in');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            })
          })
        }
      })
  }
});

//login post request 
routes.post('/login', (req, res, next)=>{
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

routes.get('/logout', (req, res)=>{
  req.logout((err) => {
    if(err) throw err;
  });
  req.flash('success_msg', 'you are logged out');
  res.redirect('/users/login');
});

module.exports = routes;