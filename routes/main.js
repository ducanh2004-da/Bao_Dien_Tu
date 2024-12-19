const express = require('express');
const profileController = require('../controllers/profile');
const { validateQuery } = require('../validators/validators');


const router = express.Router();
const MainController = require('../controllers/main');

router.get('/',MainController.showMainPage);
router.get('/post/:id', MainController.showDetail);
router.post('/post/like/:id', MainController.likePost);
router.get('/category/:id', MainController.showCategory);
router.get('/search', validateQuery, MainController.search);
router.get('/profile', profileController.show);
router.get('/profile/edit', profileController.viewEdit);
router.post('/profile/update', profileController.Edit);
router.get('/subscription', MainController.showSubscription);

module.exports = router;