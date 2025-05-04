// import express from "express";
const express = require('express');
const passport = require('passport');
const csurf      = require('csurf');
const { validatePost } = require('../validators/validators');

const router = express.Router();
const AuthController = require('../controllers/auth');
// 1) Khởi tạo csurf middleware chỉ cho các route này
const csrfProtection = csurf({ cookie: true });

router.get('/',csrfProtection, AuthController.showForm);
router.post('/register', csrfProtection, validatePost,AuthController.Register);
router.post('/login', csrfProtection, validatePost,AuthController.Login);
router.post('/login-writer', csrfProtection, validatePost,AuthController.LoginWriter);
router.post('/login-editor', csrfProtection, validatePost,AuthController.LoginEditor);
router.post('/login-admin', csrfProtection, validatePost,AuthController.LoginAdmin);
// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api' }),
    (req, res) => {
        req.session.user = req.user; // Store user info in session
        const role = req.user.role;  // Get user role
        // Redirect based on role
        redirectUserByRole(role, res);
    });
// github Auth
router.get('/github', passport.authenticate('github', { scope: ['email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        req.session.user = req.user; // Store user info in session
        const role = req.user.role;  // Get user role
        // Redirect based on role
        redirectUserByRole(role, res);
    });

// Helper function for redirecting users based on role
function redirectUserByRole(role, res) {
    switch (role) {
        case 'admin':
            return res.redirect('/admin');
        case 'editor':
            return res.redirect('/editor');
        case 'writer':
            return res.redirect('/writer');
        default:
            return res.redirect('/main'); // Default route if role is unknown
    }
}


//OTP
router.route('/forgot-password')
    .get( csrfProtection,AuthController.showForgotForm)
    .post(csrfProtection,AuthController.sendOtp)

router.route('/reset-password')
    .get(csrfProtection,AuthController.showResetForm)
    .post(csrfProtection,AuthController.resetPass)

router.route('/verify-otp')
    .get(csrfProtection, (req,res) => {
        res.render('checkOtp');
        })
    .post(csrfProtection, AuthController.checkOtp)

router.get('/logout', AuthController.Logout);

module.exports = router;