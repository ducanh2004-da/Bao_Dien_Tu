const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.js");

router.get("/", homeController.showHomePage);
router.get('/post/:id',homeController.showDetail);
// router.post('/post/like/:id',homeController.likePost);

module.exports = router;
