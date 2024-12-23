const express = require("express");
const router = express.Router();
const editorController = require("../controllers/editor.js");

router.get("/", editorController.showMainPage);
router.get("/article", editorController.showArticlePage);
router.get("/article-review", editorController.showArticleReview);
router.get("/article-approved", editorController.articleApproved);
router.post("/article-rejected", editorController.articleRejected);
module.exports = router;
