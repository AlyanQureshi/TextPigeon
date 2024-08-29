const express = require("express");

const { signup, login, verification } = require('../controllers/auth.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verification', verification);

module.exports = router;