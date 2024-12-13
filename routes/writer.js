const express = require("express");
const router = express.Router();
const postController = require("../controllers/writer.js");

router.get("/", postController.showMainPage);
router.get("/post-article", postController.showPostArticlePage);
router.get("/my-article", postController.showMyArticlePage);
router.get("/fix-article", postController.showFixArticlePage);
router.post("/fix-article/submit", postController.submitFixArticle);
router.get("/refuse-article", postController.showRefuseArticlePage);
router.get("/category", postController.showCategoryPage);
router.post("/submit-article", postController.submitArticle);

module.exports = router;
