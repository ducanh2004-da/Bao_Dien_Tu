const express = require('express');
//kiểm tra xem đã đăng nhập chưa
const authMiddleware = require('../middlewares/auth');
const AuthController = require('../controllers/auth');
const profileController = require('../controllers/profile');

const router = express.Router();
const MainController = require('../controllers/main');

router.get('/',authMiddleware.isUser, MainController.showMainPage);
router.get('/post/:id', authMiddleware.isUser, MainController.showDetail);
router.post('/post/like/:id', authMiddleware.isUser, MainController.likePost);
router.get('/profile',authMiddleware.isUser, profileController.show);
router.get('/profile/edit', authMiddleware.isUser, profileController.viewEdit);
router.post('/profile/update',authMiddleware.isUser,profileController.Edit);

module.exports = router;