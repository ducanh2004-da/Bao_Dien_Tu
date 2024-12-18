const express = require("express");
const router = express.Router();
const postController = require("../controllers/writer.js");
const authMiddleware = require("../middlewares/auth");
const writerModel = require("../models/writer");

router.get("/", authMiddleware.isUser, authMiddleware.isWriter, (req, res) => {
    res.redirect("/writer/my-articles");
});
router.get("/post-article", authMiddleware.isUser, authMiddleware.isWriter, postController.showPostArticlePage);
router.get("/my-articles", authMiddleware.isUser, authMiddleware.isWriter, postController.showMyArticlePage);
router.get("/fix-article", authMiddleware.isUser, authMiddleware.isWriter, postController.showFixArticlePage);
router.post("/fix-article/submit", authMiddleware.isUser, authMiddleware.isWriter, postController.submitFixArticle);
router.get("/refuse-article", authMiddleware.isUser, authMiddleware.isWriter, async (req, res) => {
    const id = req.query.id;
    writerModel.getArticlesById(id, (err, article) => {
        if (err) {
            return;
        }
        // Get the column refuse in the article
        const refuse = article[0].refuse;
        return res.json({ refuse });
    });
});
router.get("/category", authMiddleware.isUser, authMiddleware.isWriter, postController.showCategoryPage);
router.post("/submit-article", authMiddleware.isUser, authMiddleware.isWriter, postController.submitArticle);

module.exports = router;
