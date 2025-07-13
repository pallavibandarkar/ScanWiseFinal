const express = require('express')
const router = express.Router();
const userController = require('../controllers/user.js')

router.post('/signup',userController.signUp);
router.post('/login',userController.login);
router.post('/verify-otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp);


module.exports = router;