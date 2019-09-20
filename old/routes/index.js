var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "hOmewRecKerzzzzz" });
});

router.get('/lotta-llama', function(req, res, next) {
  res.render('llama', { title: "lottallama | hOmewRecKerzzzzz" });
});

router.get('/play', function(req, res, next) {
  res.render('play', { title: 'play | hOmewRecKerzzzzz' });
});

module.exports = router;
