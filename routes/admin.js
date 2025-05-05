const express = require('express');
const router = express.Router();
const csurf = require('csurf');
const AdminController = require('../controllers/admin');

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,         // Bật HttpOnly
    sameSite: 'Strict',      // SameSite cookie
    secure: process.env.NODE_ENV === 'production', // Secure cookie trong production
  }
});

router.get('/',csrfProtection, AdminController.showAll);
router.get('/post/detail', AdminController.viewPost);
router.post('/post/:id/accept', csrfProtection, AdminController.acceptPost);
router.post('/post/:id/notaccept', csrfProtection, AdminController.notAcceptPost);
router.post('/category/create', csrfProtection, AdminController.addCategory)
router.get('/category/:id/edit', AdminController.viewEditCategory);
router.post('/category/:id/edit', csrfProtection, AdminController.EditCategory);
router.post('/category/:id/delete',csrfProtection, AdminController.deleteCategory);
router.get('/category/create', AdminController.viewAddCategory);
router.get('/:id/detailUser', AdminController.viewUser);
router.get('/user/:id/edit', AdminController.viewEditUser);
router.post('/user/:id/delete', csrfProtection, AdminController.deleteUser);
router.post('/user/:id/edit', csrfProtection, AdminController.EditUser);
router.get('/post/:id/edit', AdminController.viewEditPost);
router.post('/post/:id/edit', csrfProtection, AdminController.EditPost);
router.get('/user/:id/delay', AdminController.Delay);
module.exports = router;