var express = require('express');
var router = express.Router();

var userController = require("../controller/userController");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//  /api/user/singin
router.post("/singin", userController.singin.bind(userController));

// /api/user/login
router.post("/login", userController.login.bind(userController));

//  /api/user/logout
router.get("/logout", userController.logout.bind(userController));

// /api/user/islogin
router.get("/islogin", userController.islogin.bind(userController));


module.exports = router;