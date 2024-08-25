const express = require("express");

const { friendRequest, getFriendRequests } = require('../controllers/friends.js');

const router = express.Router();

router.post('/friendRequest', friendRequest);
router.post('/getFriendRequests', getFriendRequests);

module.exports = router;