const express = require("express");
const router = express.Router();
const editorController = require("../controllers/editor.js");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware.isUser, authMiddleware.isEditor, editorController.showMainPage);
router.get("/article", authMiddleware.isUser, authMiddleware.isEditor, editorController.showArticlePage);
router.get("/article-review", authMiddleware.isUser, authMiddleware.isEditor, editorController.showArticleReview);
router.post("/article-approved", authMiddleware.isUser, authMiddleware.isEditor, editorController.articleApproved);
router.post("/article-rejected", authMiddleware.isUser, authMiddleware.isEditor, editorController.articleRejected);
module.exports = router;
