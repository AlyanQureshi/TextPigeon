const express = require("express");

const { friendRequest, getFriendRequests, getFriends, acceptFriend, denyFriend, unfriend } = require('../controllers/friends.js');

const router = express.Router();

router.post('/friendRequest', friendRequest);
router.post('/getFriendRequests', getFriendRequests);
router.post('/getFriends', getFriends);
router.post('/acceptFriend', acceptFriend);
router.post('/denyFriend', denyFriend);
router.post('/unfriend', unfriend);

module.exports = router;