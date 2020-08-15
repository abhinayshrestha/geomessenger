const express = require('express');
const router = express.Router();
const chatContrtoller = require('../controller/chatController');
const authCheck = require('../util/authCheck');

router.post('/:id', authCheck ,chatContrtoller.sendMessage);
router.put('/:id', authCheck, chatContrtoller.loadMessage);

module.exports = router;