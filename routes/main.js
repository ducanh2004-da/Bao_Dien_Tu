const express = require('express');
//kiểm tra xem đã đăng nhập chưa
const authMiddleware = require('../middlewares/auth');
const AuthController = require('../controllers/auth');
const profileController = require('../controllers/profile');
const { validateQuery } = require('../validators/validators');


const router = express.Router();
const MainController = require('../controllers/main');

router.get('/',MainController.showMainPage);
router.get('/post/:id', MainController.showDetail);
router.post('/post/like/:id', MainController.likePost);
router.get('/search', validateQuery, MainController.search);
router.get('/profile', profileController.show);
router.get('/profile/edit', profileController.viewEdit);
router.post('/profile/update', profileController.Edit);

module.exports = router;