const express = require("express");

const { friendRequest } = require('../controllers/friends.js');

const router = express.Router();

router.post('/friendRequest', friendRequest);

module.exports = router;