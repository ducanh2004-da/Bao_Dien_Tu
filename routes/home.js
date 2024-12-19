const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.js");
const { validateQuery } = require('../validators/validators');

router.get("/", homeController.showHomePage);
router.get('/post/:id',homeController.showDetail);
router.get('/search', validateQuery, homeController.search);
// router.post('/post/like/:id',homeController.likePost);

module.exports = router;
