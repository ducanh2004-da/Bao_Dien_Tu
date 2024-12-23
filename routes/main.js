const express = require('express');
//kiểm tra xem đã đăng nhập chưa
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
const MainController = require('../controllers/main');

router.get('/',authMiddleware.isUser,MainController.showMainPage);

module.exports = router;