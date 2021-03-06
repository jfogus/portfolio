const express = require('express');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const dotenv = require('dotenv');

// Set up environment variables
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

// Create the app
const app = express();

// View engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Top level routing
require('./routes/index.routes')(app);
require('./routes/portfolio.routes')(app);

// Catch and handle 404 errors
app.use((req, res) => {
  res.type('text/plain');
  res.status(404)
  res.send('404 - Not Found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server error');
});

module.exports = app;