const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/ChatbotController');

router.post('/chat', chatbotController.chat);

module.exports = router; 