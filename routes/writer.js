const express = require("express");
const router = express.Router();
const postController = require("../controllers/writer.js");
const authMiddleware = require("../middlewares/auth");
const writerModel = require("../models/writer");

router.get("/", authMiddleware.isUser, authMiddleware.isWriter, (req, res) => {
    res.redirect("/writer/my-articles");
});
router.get("/post-article", postController.showPostArticlePage);
router.get("/my-articles", postController.showMyArticlePage);
router.get("/fix-article", postController.showFixArticlePage);
router.post("/fix-article/submit", postController.submitFixArticle);
router.get("/refuse-article", async (req, res) => {
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
router.get("/category", postController.showCategoryPage);
router.post("/submit-article", postController.submitArticle);

module.exports = router;
