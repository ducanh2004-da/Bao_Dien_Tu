const express = require('express');
//kiểm tra xem đã đăng nhập chưa
const authMiddleware = require('../middlewares/auth');
const AuthController = require('../controllers/auth');

const router = express.Router();
const MainController = require('../controllers/main');

router.get('/',authMiddleware.isUser,MainController.showMainPage);
router.get('/post/:id',MainController.showDetail);
router.post('/post/like/:id',MainController.likePost);



module.exports = router;