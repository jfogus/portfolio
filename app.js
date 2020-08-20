const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

// Include routers
const indexRouter = require('./routes/index');
const cvRouter = require('./routes/cv');
const portfolioRouter = require('./routes/portfolio');
const contactRouter = require('./routes/contact');

// Create the app
const app = express();

// view engine setup
app.engine('handlebars', exphbs);
app.set('view engine', 'hbs');

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Top level routing
app.use('/', indexRouter);
app.use('/cv', cvRouter);
app.use('/portfolio', portfolioRouter);
app.use('/contact', contactRouter);

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

// Listen on provided port, on all network interfaces.

// app.listen(app.get('port'), () => {
//   console.log('Express started on http://localhost:' + app.get('port'));
// });

module.exports = app;