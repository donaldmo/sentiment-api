const express = require('express');
const router = express.Router();
const sentimentCtrl = require('../controllers/sentiment.controller');
const { verifyAccessToken } = require('../helpers/jwt_helper');

router.get('/', sentimentCtrl.getSentiment);

module.exports = router; 