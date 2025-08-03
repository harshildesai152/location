// routes/index.js
const express = require('express');
const router = express.Router();

const { getsignupList } = require('../controllers/signupController');
const { getlogin } = require('../controllers/loginController');
const { addLocation } = require('../controllers/LocationController');
const { getUserLocations } = require('../controllers/getLocationController');
const { uploadLocationFile } = require('../controllers/uploadLocationFileController');
const {logoutUser} = require('../controllers/logoutController');
const { authenticate } = require('../middleware/authenticate'); 
const upload = require('../middleware/uploadMiddleware');
const { checkAuth } = require('../controllers/checkAuthController');

router.post('/signup', getsignupList);
router.post('/login', getlogin);
router.post('/logout', logoutUser);

router.post('/addLocation', authenticate, addLocation);
router.get('/getLocation', authenticate, getUserLocations);
router.get('/check-auth', checkAuth);


router.post(
 '/uploadLocationFile',
 authenticate,
 upload, 
 uploadLocationFile
);
module.exports = router;