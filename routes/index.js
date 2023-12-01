const express = require('express');
const routes = express.Router();
const { ensureAuthenticated } = require('../config/auth');

routes.get('/',(req, res)=>{res.render('welcome')});

routes.get('/dashboard', ensureAuthenticated, (req, res)=>{
  res.render('dashboard', { user : req.user });
});

module.exports = routes;