var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "hOmewRecKerzzzzz" });
});

router.get('/lotta-llama', function(req, res, next) {
  res.render('lotta_llama', { title: "lottallama | hOmewRecKerzzzzz" });
});

module.exports = router;
