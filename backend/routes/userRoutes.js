// routes/index.js
const express = require('express');
const router = express.Router();

const { getsignupList } = require('../controllers/signupController');
const { getlogin } = require('../controllers/loginController');
const { addLocation } = require('../controllers/LocationController');
const { getUserLocations } = require('../controllers/getLocationController');
const { uploadLocationFile } = require('../controllers/uploadLocationFileController');

const { authenticate } = require('../middleware/authenticate'); // Correct path
const upload = require('../middleware/uploadMiddleware'); // Multer configuration

// Public routes (no authentication needed)
router.post('/signup', getsignupList);
router.post('/login', getlogin);

// Authenticated routes
router.post('/addLocation', authenticate, addLocation);
router.get('/getLocation', authenticate, getUserLocations);

// Upload ZIP file, extract abs.txt, and save data
// Expecting form-data with key: 'file'
router.post(
 '/uploadLocationFile',
 authenticate,
 upload, // Use the exported upload middleware directly
 uploadLocationFile
);
module.exports = router;