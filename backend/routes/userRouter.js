const express = require('express');
const authCheck = require('../util/authCheck');
const router  = express.Router();
const userController = require('../controller/userController');


router.get('/get-user-data', authCheck ,userController.getUserData);
router.post('/find-friends', authCheck, userController.findFriends);
router.get('/inbox', authCheck, userController.loadInbox);
router.post('/create-inbox', userController.createInbox);
router.post('/get-user-info', authCheck, userController.getUserInfo);
router.post('/set-inbox-status', authCheck, userController.setReadStatus);
router.post('/setting/update-info', authCheck, userController.updateSetting);
router.post('/setting/change-profilepic', authCheck, userController.changeProfilePic);
router.get('/set-read-status' , authCheck, userController.getReadStatus);
router.post('/compare-location', authCheck, userController.compareLocation);

module.exports = router;