const express = require('express');
const profileController = require('../controllers/profile');
const { validateSearch, validatePage } = require('../validators/validators');
const csurf = require('csurf');
const { upload } = require('../cloudinary/Cloud');


const router = express.Router();
const MainController = require('../controllers/main');

const csrfProtection = csurf({
  cookie: { 
    httpOnly: true,
    sameSite: 'strict', // Dấu phẩy ở cuối
    secure: process.env.NODE_ENV === 'production' // Không có dấu phẩy ở cuối
  }
});

router.get('/', csrfProtection, MainController.showMainPage);
router.get('/post/:id', csrfProtection, MainController.showDetail);
router.post('/post/like/:id', csrfProtection, MainController.likePost);
router.get('/category/:id', csrfProtection, validatePage, MainController.showCategory);
router.get('/search',csrfProtection, validateSearch, MainController.search);
router.get('/profile',csrfProtection, profileController.show);
router.get('/profile/edit',csrfProtection, profileController.viewEdit);
router.post('/profile/update',upload.single('image'),csrfProtection, profileController.Edit);
router.post('/post/:id/comment',csrfProtection, MainController.comment);
router.get('/subscription',csrfProtection, MainController.showSubscription);
router.post('/subscribe',csrfProtection, MainController.subscribe);
router.post('/extendSubscription',csrfProtection, MainController.extendSubscription);
router.get('/tag/:name',csrfProtection, validatePage, MainController.showTag);
// router.post('/unsubscribe', MainController.unsubscribe);

module.exports = router;