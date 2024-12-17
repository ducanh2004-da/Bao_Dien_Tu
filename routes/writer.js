const express = require("express");
const router = express.Router();
const postController = require("../controllers/writer.js");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware.isUser, authMiddleware.isWriter, postController.showMainPage);
router.get("/post-article", authMiddleware.isUser, authMiddleware.isWriter, postController.showPostArticlePage);
router.get("/my-article", authMiddleware.isUser, authMiddleware.isWriter, postController.showMyArticlePage);
router.get("/fix-article", authMiddleware.isUser, authMiddleware.isWriter, postController.showFixArticlePage);
router.post("/fix-article/submit", authMiddleware.isUser, authMiddleware.isWriter, postController.submitFixArticle);
router.get("/refuse-article", authMiddleware.isUser, authMiddleware.isWriter, postController.showRefuseArticlePage);
router.get("/category", authMiddleware.isUser, authMiddleware.isWriter, postController.showCategoryPage);
router.post("/submit-article", authMiddleware.isUser, authMiddleware.isWriter, postController.submitArticle);

module.exports = router;
