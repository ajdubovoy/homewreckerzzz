var express = require('express');
var router = express.Router();
var multer = require('multer');

//uploads dir must already be present or else file upload does not work
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads')
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
})

var upload = multer({storage: storage});

router.post('/', upload.single('userFile'), function(req, res) {
    res.send(200);
})

module.exports = router;