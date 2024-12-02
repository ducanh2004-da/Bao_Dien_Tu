// import express from "express";
const express = require('express');
const passport = require('passport');
const validatePost = require('../validators/postValidator');

const router = express.Router();
const AuthController = require('../controllers/auth');

router.get('/',AuthController.showForm);
router.post('/register',validatePost,AuthController.Register);
router.post('/login',validatePost,AuthController.Login);
// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api' }), 
(req, res) => {
    req.session.user = req.user;
    res.redirect('/main');
});
// github Auth
router.get('/github', passport.authenticate('github', { scope: ['email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/api' }), 
    (req, res) => {
        req.session.user = req.user; // Lưu thông tin người dùng trong session
        res.redirect('/main'); // Chuyển hướng sau khi đăng nhập thành công
    }
);


//OTP
router.route('/forgot-password')
.get(AuthController.showForgotForm)
.post(AuthController.sendOtp)

router.route('/reset-password')
.get(AuthController.showResetForm)
.post(validatePost,AuthController.resetPass)

router.route('/verify-otp')
.get((req,res)=>{
    res.render('checkOtp');
})
.post(validatePost,AuthController.checkOtp)

router.get('/logout', AuthController.Logout);

module.exports = router;