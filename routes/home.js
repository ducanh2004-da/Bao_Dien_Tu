const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.js");
const { validateSearch, validatePage } = require('../validators/validators');

router.get("/", homeController.showHomePage);
router.get('/post/:id',homeController.showDetail);
router.get('/search',validateSearch, homeController.search);
router.get('/category/:id', validatePage, homeController.showCategory);
router.get('/tag/:name',validatePage, homeController.showTag);

module.exports = router;
