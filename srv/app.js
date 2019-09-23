var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
// var postcssMiddleware = require('postcss-middleware');
// var autoprefixer = require('autoprefixer');
var browserify = require('browserify-middleware');

var indexRouter = require('./routes/index');

var app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Browserify JS
browserify.settings({
  transform: ['babelify']
});
app.get('/app.js', browserify('./vue/app.js'));

// SASS
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
// var destPath = path.join(__dirname, 'public');
// app.use(postcssMiddleware({
//   plugins: [
//     /* Plugins */
//     autoprefixer({
//       /* Options */
//     })
//   ],
//   src: function(req) {
//     return path.join(destPath, req.url);
//   }
// }));

// PUG Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/', indexRouter);
app.use('/lotta-llama', indexRouter);
app.use('/play', indexRouter);

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
  res.render('error');
});


module.exports = app;