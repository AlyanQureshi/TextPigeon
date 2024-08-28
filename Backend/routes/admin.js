const express = require("express");

const { grantAdmin, revokeAdmin } = require('../controllers/admin.js');

const router = express.Router();

router.post('/grant', grantAdmin);
router.post('/revoke', revokeAdmin);

module.exports = router;