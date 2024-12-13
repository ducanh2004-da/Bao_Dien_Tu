const express = require('express');
//kiểm tra xem đã đăng nhập chưa
const authMiddleware = require('../middlewares/auth');
<<<<<<< HEAD
=======
const AuthController = require('../controllers/auth');
>>>>>>> 1095213 (Hoan thien dang ki dang nhap,admin,guest,editor,writer)

const router = express.Router();
const MainController = require('../controllers/main');

router.get('/',authMiddleware.isUser,MainController.showMainPage);
<<<<<<< HEAD
=======
router.get('/post/:id',MainController.showDetail);
router.post('/post/like/:id',MainController.likePost);


>>>>>>> 1095213 (Hoan thien dang ki dang nhap,admin,guest,editor,writer)

module.exports = router;